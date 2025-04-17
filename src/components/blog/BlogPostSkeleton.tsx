
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const BlogPostSkeleton: React.FC = () => {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
      <div className="h-48 bg-zinc-800 animate-pulse"></div>
      <CardContent className="p-6">
        <div className="w-20 h-6 rounded-full bg-zinc-800 animate-pulse mb-3"></div>
        <div className="h-7 bg-zinc-800 animate-pulse mb-2 rounded"></div>
        <div className="h-7 bg-zinc-800 animate-pulse mb-3 rounded w-3/4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-zinc-800 animate-pulse rounded"></div>
          <div className="h-4 bg-zinc-800 animate-pulse rounded"></div>
          <div className="h-4 bg-zinc-800 animate-pulse rounded w-2/3"></div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="w-20 h-4 bg-zinc-800 animate-pulse rounded"></div>
            <div className="w-20 h-4 bg-zinc-800 animate-pulse rounded"></div>
          </div>
          <div className="w-16 h-4 bg-zinc-800 animate-pulse rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostSkeleton;
