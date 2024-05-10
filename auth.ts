// 1. 该文件扩展 auth.config.ts 导出的 authConfig 对象，应该是应用于登录action
// 2.
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials'; // web认证
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // providers是一个数组，其中列出了不同的登录选项
  providers: [
    // 在 next-auth 库中，Credentials 是一个用于实现基于凭证的登录（如用户名和密码）的函数。
    // 它允许用户通过输入凭证（通常是用户名和密码）来登录系统。
    // Credentials 作为 next-auth 的一个选项，提供了一种简单的方式来添加用户名和密码登录功能，而无需集成第三方登录服务。
    Credentials({
      // 1. 使用 zod 库（一个用于数据验证的库）来解析和验证用户输入的电子邮件和密码是否符合预期的格式。
      // 2. 如果凭证解析成功，代码将尝试检索与提供的电子邮件地址匹配的用户。
      // 3. 如果找到了用户，将使用 bcrypt 库来比较用户提供的密码与存储的密码是否匹配。
      // 4. 如果密码匹配，authorize 函数将返回用户对象，这表示用户验证成功。
      // 5. 如果凭证无效或密码不匹配，函数将返回 null，表示验证失败。
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
