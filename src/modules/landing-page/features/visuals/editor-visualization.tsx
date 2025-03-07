export const EditorVisualization = () => {
  return (
    <div className="w-full h-full bg-card flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          research_notes.md
        </div>
        <div className="w-4" />
      </div>

      <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
        <div className="space-y-6">
          <div className="text-xl font-bold text-primary">
            # Research Notes: Algorithmic Complexity Analysis
          </div>

          <div className="text-foreground">
            Today I&apos;m exploring the relationship between computational
            complexity and practical algorithm performance. Below are some key
            equations and code examples that demonstrate these concepts.
          </div>

          <div className="space-y-2">
            <div className="text-lg font-semibold text-primary">
              ## Mathematical Foundations
            </div>
            <div className="pl-4 border-l-2 border-primary/20 py-2">
              <div className="mb-2">
                The time complexity of an algorithm is commonly expressed using
                Big O notation:
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center my-3 text-primary">
                T(n) = O(f(n))
              </div>
              <div className="mb-2">
                For recursive algorithms, we can use the Master Theorem to solve
                recurrence relations:
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center my-3 text-primary">
                T(n) = aT(n/b) + f(n)
              </div>
              <div className="mb-2">
                The expected number of comparisons for quicksort is:
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center my-3 text-primary">
                E[X] = 2n\ln(n) - O(n)
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-lg font-semibold text-primary">
              ## Implementation in Rust
            </div>
            <div className="bg-[#2d2d2d] text-[#d4d4d4] p-3 rounded-lg font-mono text-xs leading-relaxed">
              <div>
                <span className="text-[#569cd6]">fn</span>{" "}
                <span className="text-[#dcdcaa]">quick_sort</span>&lt;T:{" "}
                <span className="text-[#4ec9b0]">Ord</span>&gt;(
                <span className="text-[#9cdcfe]">arr</span>:{" "}
                <span className="text-[#4ec9b0]">&mut</span> [T]) {"{"}
              </div>
              <div className="pl-4">
                <span className="text-[#c586c0]">if</span> arr.len() &lt;={" "}
                <span className="text-[#b5cea8]">1</span> {"{"}
              </div>
              <div className="pl-8">
                <span className="text-[#c586c0]">return</span>;
              </div>
              <div className="pl-4">{"}"}</div>
              <div className="pl-4"></div>
              <div className="pl-4">
                <span className="text-[#569cd6]">let</span>{" "}
                <span className="text-[#9cdcfe]">pivot</span> = arr.len() -{" "}
                <span className="text-[#b5cea8]">1</span>;
              </div>
              <div className="pl-4">
                <span className="text-[#569cd6]">let</span>{" "}
                <span className="text-[#9cdcfe]">pivot</span> ={" "}
                <span className="text-[#dcdcaa]">partition</span>(arr, pivot);
              </div>
              <div className="pl-4"></div>
              <div className="pl-4">
                <span className="text-[#dcdcaa]">quick_sort</span>(&
                <span className="text-[#c586c0]">mut</span> arr[..pivot]);
              </div>
              <div className="pl-4">
                <span className="text-[#dcdcaa]">quick_sort</span>(&
                <span className="text-[#c586c0]">mut</span> arr[pivot +{" "}
                <span className="text-[#b5cea8]">1</span>..]);
              </div>
              <div>{"}"}</div>
              <div></div>
              <div>
                <span className="text-[#569cd6]">fn</span>{" "}
                <span className="text-[#dcdcaa]">partition</span>&lt;T:{" "}
                <span className="text-[#4ec9b0]">Ord</span>&gt;(
                <span className="text-[#9cdcfe]">arr</span>:{" "}
                <span className="text-[#4ec9b0]">&mut</span> [T],{" "}
                <span className="text-[#9cdcfe]">pivot</span>:{" "}
                <span className="text-[#4ec9b0]">usize</span>) -&gt;{" "}
                <span className="text-[#4ec9b0]">usize</span> {"{"}
              </div>
              <div className="pl-4">
                <span className="text-[#569cd6]">let</span>{" "}
                <span className="text-[#9cdcfe]">len</span> = arr.len();
              </div>
              <div className="pl-4">
                arr.swap(pivot, len - <span className="text-[#b5cea8]">1</span>
                );
              </div>
              <div className="pl-4"></div>
              <div className="pl-4">
                <span className="text-[#569cd6]">let</span>{" "}
                <span className="text-[#c586c0]">mut</span>{" "}
                <span className="text-[#9cdcfe]">store_idx</span> ={" "}
                <span className="text-[#b5cea8]">0</span>;
              </div>
              <div className="pl-4">
                <span className="text-[#c586c0]">for</span>{" "}
                <span className="text-[#9cdcfe]">i</span>{" "}
                <span className="text-[#c586c0]">in</span>{" "}
                <span className="text-[#b5cea8]">0</span>..len -{" "}
                <span className="text-[#b5cea8]">1</span> {"{"}
              </div>
              <div className="pl-8">
                <span className="text-[#c586c0]">if</span> arr[i] &lt;= arr[len
                - <span className="text-[#b5cea8]">1</span>] {"{"}
              </div>
              <div className="pl-12">arr.swap(i, store_idx);</div>
              <div className="pl-12">
                store_idx += <span className="text-[#b5cea8]">1</span>;
              </div>
              <div className="pl-8">{"}"}</div>
              <div className="pl-4">{"}"}</div>
              <div className="pl-4"></div>
              <div className="pl-4">
                arr.swap(store_idx, len -{" "}
                <span className="text-[#b5cea8]">1</span>);
              </div>
              <div className="pl-4">store_idx</div>
              <div>{"}"}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-lg font-semibold text-primary">
              ## Performance Analysis
            </div>
            <div className="pl-4 space-y-2">
              <div>- Time Complexity: O(n log n) average case</div>
              <div>- Space Complexity: O(log n) for recursion stack</div>
              <div>
                - Not stable, but can be optimized with various pivot selection
                strategies
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
