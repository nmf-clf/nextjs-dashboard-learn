// Middleware .js|ts文件用于编写中间件，并在请求完成之前在服务器上运行代码。
// 然后，根据传入的请求，您可以通过重写、重定向、修改请求或响应头或直接响应来修改响应。

// 中间件在路由呈现之前执行。它对于实现自定义服务器端逻辑(如身份验证、日志记录或处理重定向)特别有用。

// 使用文件中间件.ts(或.js)在项目的根目录中定义中间件。例如，在应用程序或页面的同一层，或者在src中(如果适用)。
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
export default NextAuth(authConfig).auth;
// 中间件必须指定一个默认导出
import { NextResponse, NextRequest } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   // Middleware logic goes here
//   if (request.nextUrl.pathname === '/dashboard') {
//     return NextResponse.redirect(
//       new URL('http://localhost:3000/login', request.url),
//     );
//   }
//   // 如果不是特定的路由，则继续处理请求
//   return NextResponse.next();
// }

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// 该文件必须导出单个函数，要么作为默认导出，要么作为命名中间件导出。注意，不支持来自同一文件的多个中间件。
