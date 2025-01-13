export default function Home() {
    return (
      <div className="space-y-8">
        <article className="space-y-2">
          <h2 className="text-xl font-bold hover:text-gray-600">
            Two Pointer Pattern for Problem Solving
          </h2>
          <p className="text-gray-600">
            The strategy involves using two pointers typically represent two indices
            (P1- starting at index 0 / P2-starting at index n-1) that...
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>6d ago</span>
            <span>2 views</span>
          </div>
        </article>
  
        <article className="space-y-2">
          <h2 className="text-xl font-bold hover:text-gray-600">
            Basics of BigO notations
          </h2>
          <p className="text-gray-600">
            Maintaining Time and Space complexity or in simple words, performance and
            memory management of an algorithm is an...
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Dec 31, 2024</span>
          </div>
        </article>
      </div>
    )
  }
  
  