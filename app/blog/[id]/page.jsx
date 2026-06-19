import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }) {
  const { id } = await params;

  const post = await db.blogPost.findUnique({
    where: { id }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl min-h-screen">
      <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all articles
      </Link>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground font-medium">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            <span className="mx-2">•</span>
            <span>By SPY AI Coach</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{post.title}</h1>
        </div>

        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border">
          <Image 
            src={post.imageUrl} 
            alt={post.title} 
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <div className="mt-16 pt-8 border-t text-center">
        <h3 className="text-2xl font-bold mb-4">Want personalized advice?</h3>
        <p className="text-muted-foreground mb-6">Create a free account to generate your own AI-powered resume, cover letters, and interview prep.</p>
        <Link href="/sign-in" className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
          Get Started for Free
        </Link>
      </div>
    </div>
  );
}
