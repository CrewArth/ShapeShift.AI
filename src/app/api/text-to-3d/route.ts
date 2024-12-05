import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongodb';
import { Collection, Db } from 'mongodb';

const FAL_API_URL = 'https://110602490-triposr.gateway.alpha.fal.ai/';

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Received request body:', body);
    
    // Check if API key is available
    if (!process.env.FAL_KEY) {
      console.error('Fal.ai API key is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const models = db.collection('models');

    // First, submit the generation request
    console.log('Submitting request to Fal.ai API...');
    const submitResponse = await fetch(FAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${process.env.FAL_KEY}`,
      },
      body: JSON.stringify({
        "model_inputs": {
          "prompt": body.text,
          "negative_prompt": body.negative_text || "low quality, bad geometry, distorted",
          "num_inference_steps": 50,
          "guidance_scale": 7.5,
          "seed": -1,
          "scheduler": "DDIM",
          "enable_base_model_hook": false,
          "use_base_model": false,
          "use_cpu_offload": false,
          "width": 768,
          "height": 768
        }
      })
    });

    const submitData = await submitResponse.json();
    console.log('Fal.ai API submit response:', submitData);

    if (!submitResponse.ok) {
      console.error('Fal.ai API error:', submitData);
      return NextResponse.json(
        { error: submitData.error || submitData.detail || 'Failed to submit 3D model generation' },
        { status: submitResponse.status }
      );
    }

    // Store initial model information in MongoDB
    const model = await models.insertOne({
      userId,
      prompt: body.text,
      falRequestId: submitData.request_id,
      status: 'processing',
      createdAt: new Date()
    });

    // Poll for the result
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes maximum wait time
    let modelUrl = null;

    while (attempts < maxAttempts) {
      console.log(`Checking generation status (attempt ${attempts + 1})...`);
      
      const checkResponse = await fetch(`${FAL_API_URL}${submitData.request_id}`, {
        headers: {
          'Authorization': `Key ${process.env.FAL_KEY}`,
        }
      });

      const checkData = await checkResponse.json();
      console.log('Status check response:', checkData);

      if (checkData.status === 'completed' && checkData.glb_url) {
        modelUrl = checkData.glb_url;
        // Update model in database with the URL
        await models.updateOne(
          { _id: model.insertedId },
          { 
            $set: {
              status: 'completed',
              modelUrl: checkData.glb_url,
              thumbnailUrl: checkData.thumbnail_url || null,
              format: 'glb',
              updatedAt: new Date()
            }
          }
        );
        break;
      } else if (checkData.status === 'failed') {
        await models.updateOne(
          { _id: model.insertedId },
          { 
            $set: {
              status: 'failed',
              error: checkData.error || 'Generation failed',
              updatedAt: new Date()
            }
          }
        );
        return NextResponse.json(
          { error: checkData.error || 'Generation failed' },
          { status: 500 }
        );
      }

      // Wait 10 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 10000));
      attempts++;
    }

    if (!modelUrl) {
      await models.updateOne(
        { _id: model.insertedId },
        { 
          $set: {
            status: 'failed',
            error: 'Generation timed out',
            updatedAt: new Date()
          }
        }
      );
      return NextResponse.json(
        { error: 'Generation timed out' },
        { status: 408 }
      );
    }

    return NextResponse.json({ 
      success: true,
      modelUrl,
      modelId: model.insertedId 
    });
  } catch (error) {
    console.error('Error in text-to-3d API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const modelId = searchParams.get('modelId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_MESHY_API_KEY) {
      console.error('Meshy API key is not configured');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    console.log('Checking task status for ID:', taskId);
    const response = await fetch(`https://api.meshy.ai/v2/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MESHY_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Task status response:', data);

    if (!response.ok) {
      console.error('Task status error:', data);
      if (modelId) {
        await modelsCollection.updateOne(
          { _id: modelId },
          { $set: { status: 'failed' } }
        );
      }
      return NextResponse.json(
        { error: data.error || data.message || 'Failed to check task status' },
        { status: response.status }
      );
    }

    // Update model status in database
    if (modelId && data.status === 'succeeded') {
      await modelsCollection.updateOne(
        { _id: modelId },
        { $set: {
          status: 'completed',
          modelUrl: data.result.model_url,
          thumbnail: data.result.thumbnail_url || null
        }}
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in text-to-3d status API route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 

function connectDB() {
  throw new Error('Function not implemented.');
}
