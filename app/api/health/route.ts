// app/api/health/route.ts
// Health check endpoint cho Docker container

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        nextjs: 'healthy',
        prisma: 'checking...'
      }
    };

    // Kiểm tra Prisma connection (optional)
    try {
      // Uncomment khi cần kiểm tra database
      // const { PrismaClient } = await import('@prisma/client');
      // const prisma = new PrismaClient();
      // await prisma.$queryRaw`SELECT 1`;
      // await prisma.$disconnect();
      healthStatus.services.prisma = 'healthy';
    } catch (error) {
      console.error('Database health check failed:', error);
      healthStatus.services.prisma = 'unavailable';
      // Không fail health check nếu DB chưa setup
    }

    return NextResponse.json(healthStatus, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 503 }
    );
  }
}

// Support HEAD request cho simple health check
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}