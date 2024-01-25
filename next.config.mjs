import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import createMDX from '@next/mdx'
import { execSync } from 'child_process';
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Pass the last commit date to the app for last-updated
  env:{
    LAST_COMMIT_DATE : execSync('git log -1 --format=%cd --date=short').toString().trim(),
  }
}
 
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeHighlight, rehypeKatex],
  },
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)
