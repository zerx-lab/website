import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// 文档集合配置
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// 博客 frontmatter schema，扩展默认 schema 添加 date 字段
const blogFrontmatterSchema = frontmatterSchema.extend({
  date: z.date().optional(),
});

// 博客集合配置 - 使用 defineDocs 创建独立的博客集合
export const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: blogFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
