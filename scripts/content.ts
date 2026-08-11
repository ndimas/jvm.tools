// AUTO-GENERATED content module: deep-dives and guides.
// Source of truth = scripts/_deepdives_partial.json + scripts/_guides_partial.json (edit via build scripts).
// Regenerate with: bun scripts/generate.ts
import { TOOLS, type Tool } from "./data.ts";

export interface DeepDive {
  slug: string; category: string; toolSlug: string; h1: string;
  metaTitle: string; metaDescription: string;
  intro: string[]; useWhen: string[]; avoidWhen: string[];
  basics: { title: string; body: string[]; code?: string }[];
  quickstart: { title: string; body: string[]; code: string }[];
  faq: { q: string; a: string }[]; updated: string;
}

export interface Guide {
  slug: string; category?: string;
  title: string; metaTitle: string; metaDescription: string;
  intro: string[];
  sections: { title: string; body: string[]; code?: string; table?: { cols: string[]; rows: string[][] } }[];
  faq: { q: string; a: string }[]; updated: string;
}

export const DEEP_DIVES: DeepDive[] = [
  {
    "slug": "jcmd",
    "category": "jvm-cli",
    "toolSlug": "jcmd",
    "h1": "jcmd: Send Diagnostic Commands to a Running JVM",
    "metaTitle": "jcmd examples: dump heap, threads and JFR on a live JVM",
    "metaDescription": "jcmd examples and reference: list commands, capture heap and thread dumps, start and stop Java Flight Recorder, force GC and inspect flags.",
    "intro": [
      "jcmd is the most powerful bundled JVM diagnostic tool and the one most developers under-use. Rather than juggling several binaries, jcmd sends a list of diagnostic commands to a running JVM over the Java Attach API: heap dumps, thread dumps, starting/stopping Java Flight Recorder recordings, forcing garbage collection, and reading or flipping flags.",
      "Because it speaks to any attachable local JVM, jcmd has become the natural first stop for 'what is this process doing' questions. Keep jps in your pocket to find PIDs, and jcmd for everything after that."
    ],
    "useWhen": [
      "You need to see every diagnostic command a JVM supports without memorizing separate tools.",
      "You want a heap dump, thread dump, or JFR recording captured on demand from a live process.",
      "You need to force a GC, or read/change a mutable JVM flag.",
      "You are automating diagnostics across many JVMs and want one consistent interface."
    ],
    "avoidWhen": [
      "The JVM is remote with no attach mechanism exposed; prefer JMX, JFR over a websocket, or jstatd networking.",
      "The process started with -XX:+DisableAttachMechanism; attach tools (jcmd, jmap, jstack) will refuse to connect, so use an agent or restart with attach enabled."
    ],
    "basics": [
      {
        "title": "Find processes and list commands",
        "body": [
          "jps maps Java processes to PIDs; ask the target JVM for its supported commands with jcmd <pid> help."
        ],
        "code": "# Find Java PIDs\njps -lvv\n\n# What can this JVM do?\njcmd <pid> help\n\n# List attachable JVMs\njcmd -l"
      },
      {
        "title": "Dump the heap",
        "body": [
          "Heap dumps feed Eclipse MAT for leak/dominator analysis. The default includes only live (reachable) objects, which is smaller and usually what you want."
        ],
        "code": "# Live-object heap dump\njcmd <pid> GC.heap_dump /tmp/heap.hprof\n\n# Include unreachable objects too\njcmd <pid> GC.heap_dump -all /tmp/heap-full.hprof"
      },
      {
        "title": "Dump threads",
        "body": [
          "Thread dumps are the raw material for deadlock and hang analysis. Take two dumps a few seconds apart and confirm the same threads are stuck before concluding it is a hang, not a transient wait."
        ],
        "code": "# Thread dump to a file\njcmd <pid> Thread.print -l > threads-$(date +%s).txt"
      },
      {
        "title": "Start / stop a JFR recording",
        "body": [
          "Java Flight Recorder can be started on demand via jcmd even if the JVM was not launched with JFR flags. Let it run for a window, then dump the .jfr file for analysis in JDK Mission Control."
        ],
        "code": "# Record for 60s into a file\njcmd <pid> JFR.start name=diag duration=60s filename=/tmp/diag.jfr\n\n# Status\njcmd <pid> JFR.check\n\n# Dump current recording (keeps recording)\njcmd <pid> JFR.dump name=diag filename=/tmp/diag.jfr\n\n# Stop\njcmd <pid> JFR.stop name=diag filename=/tmp/diag.jfr"
      },
      {
        "title": "Force GC and inspect flags",
        "body": [
          "For testing collector behavior or verifying which flags a process actually runs with, jcmd can explicitly trigger GC and print effective VM flags and properties."
        ],
        "code": "# Request a full GC (diagnostic/benchmark aid only)\njcmd <pid> GC.run\n\n# Effective command-line flags\njcmd <pid> VM.flags\n\n# System properties\njcmd <pid> VM.system_properties"
      }
    ],
    "quickstart": [
      {
        "title": "90-second diagnosis loop",
        "body": [
          "One pass over a live JVM: find it, capture threads, dump heap, start a short JFR recording."
        ],
        "code": "jps -l\njcmd <pid> Thread.print -l > threads.txt\njcmd <pid> GC.heap_dump heap.hprof\njcmd <pid> JFR.start duration=30s filename=diag.jfr"
      }
    ],
    "faq": [
      {
        "q": "jcmd says it cannot attach to the process. Why?",
        "a": "Attach requires the JVM to have the attach mechanism enabled and the process to be owned by a user who can attach. If it started with -XX:+DisableAttachMechanism, or runs in a hardened/containerized environment without /tmp access, attach tools fail. Run from the same user and check the runtime setup."
      },
      {
        "q": "jcmd vs jmap vs jstack — which should I use?",
        "a": "jcmd is the superset and the best default for heap dumps (GC.heap_dump), thread dumps (Thread.print) and JFR. jmap and jstack are the older dedicated tools and remain fine; reach for them only when you need a legacy flag jcmd lacks."
      },
      {
        "q": "Is jcmd production-safe?",
        "a": "Thread.print and JFR are read-only and low-overhead. GC.heap_dump and GC.run exert real pressure, so schedule those for quiet windows."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "jfr",
    "category": "jvm-cli",
    "toolSlug": "jfr",
    "h1": "Java Flight Recorder (JFR): Always-On JVM Profiling",
    "metaTitle": "Java Flight Recorder: a complete guide with jcmd and the jfr CLI",
    "metaDescription": "Java Flight Recorder guide: start recordings with -XX:StartFlightRecording, manage them with jcmd JFR.*, and read .jfr files with the jfr command and JDK Mission Control.",
    "intro": [
      "Java Flight Recorder (JFR) is the JVM's built-in, extremely low-overhead event recorder. It captures profiling events — CPU sampling, allocations, garbage collection, locks, exceptions, JIT compilation — continuously, with overhead typically measured in the low single-digit percentage. That makes it eligible to run in production permanently, which is why it is the backbone of modern Java observability.",
      "JFR data is stored in a ring buffer inside the JVM and can be started at launch with -XX:StartFlightRecording, or on demand with jcmd JFR.start. Recordings (.jfr files) are analyzed in JDK Mission Control, or parsed with the standalone jfr command."
    ],
    "useWhen": [
      "You want always-on profiling without paying a big overhead penalty.",
      "You need to reconstruct 'what was the JVM doing' after an incident — JFR's ring-buffer history is the closest thing to a JVM black box.",
      "You need CPU, allocation, GC, lock and exception data from one consistent source."
    ],
    "avoidWhen": [
      "You need stack-level sampling at extremely high frequency beyond JFR defaults — async-profiler samples more aggressively.",
      "You need source-level method timing with line numbers — fine here but richer in a dedicated profiler."
    ],
    "basics": [
      {
        "title": "Start JFR at launch",
        "body": [
          "Start a rolling recording when the JVM boots. Settings from the default.jfc are a good baseline; use profile.jfc for more detail at higher overhead."
        ],
        "code": "java -XX:StartFlightRecording=filename=/logs/app.jfr,dumponexit=true,disk=true,settings=profile -jar app.jar"
      },
      {
        "title": "Start / dump / stop with jcmd",
        "body": [
          "Manage the recording from outside the process. You can start a bounded recording, then dump its contents without stopping it."
        ],
        "code": "jcmd <pid> JFR.start name=prod duration=5m filename=/tmp/prod.jfr\njcmd <pid> JFR.check\njcmd <pid> JFR.dump name=prod filename=/tmp/prod.jfr\njcmd <pid> JFR.stop name=prod"
      },
      {
        "title": "Read a recording with the jfr command",
        "body": [
          "The standalone jfr tool prints summary or per-event information without opening a GUI."
        ],
        "code": "# Summary / metadata\njfr summary /tmp/prod.jfr\n\n# Print recorded events (counts, breakdowns)\njfr print --events jdk.GCPhasePause /tmp/prod.jfr"
      },
      {
        "title": "Analyze in JDK Mission Control",
        "body": [
          "JMC is the primary analysis UI for JFR: open the .jfr file, browse flame graphs, allocation and lock analysis, and GC pause views."
        ],
        "code": "jmc"
      }
    ],
    "quickstart": [
      {
        "title": "Record on demand and inspect",
        "body": [
          "One pass: start a short bounded recording, wait, then read back its summary."
        ],
        "code": "jcmd <pid> JFR.start duration=30s filename=diag.jfr\n# ...let it run 30 seconds...\njfr summary diag.jfr"
      }
    ],
    "faq": [
      {
        "q": "Does JFR affect production performance?",
        "a": "With the default event settings, overhead is typically under 1-2%. The profile setting is more expensive; pick it carefully. The disk-based ring buffer lets you dump history after an incident."
      },
      {
        "q": "JFR vs async-profiler — do I need both?",
        "a": "They complement each other. JFR gives broad, always-on events and incident-replay (especially GC, locks, exceptions). async-profiler gives deeper, lower-level CPU and native-stack sampling on demand. Many teams run JFR continuously and async-profiler during focused investigations."
      },
      {
        "q": "Which JDK versions include JFR?",
        "a": "JFR became open and freely usable in OpenJDK 11 and is included in all current Oracle JDK and OpenJDK distributions. If you must target an older JDK 8 build, JFR features vary by vendor."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "jmap",
    "category": "jvm-cli",
    "toolSlug": "jmap",
    "h1": "jmap: Inspect the JVM Heap and Dump It for Analysis",
    "metaTitle": "jmap examples: heap summary, memory map, and heap dump to file",
    "metaDescription": "jmap examples: print heap summaries and memory maps, capture a heap dump for Eclipse MAT, and understand jmap -histo output on a live JVM.",
    "intro": [
      "jmap (Java Memory Map) is the bundled tool for inspecting a running JVM's heap: it prints heap summaries, histograms of object counts by class, the process memory map, and — most importantly — can capture a full heap dump to a file for offline analysis.",
      "Since JDK 9, the recommended way to dump a heap is jcmd GC.heap_dump, but jmap remains widely deployed and its -histo output is a fast way to see 'which classes dominate this heap' without opening a GUI."
    ],
    "useWhen": [
      "You want a quick histogram of what is in the heap (top object counts / sizes by class).",
      "You need a heap dump file for Eclipse MAT, JProfiler, or YourKit.",
      "You need the process memory map or class-loader data from a live JVM."
    ],
    "avoidWhen": [
      "You prefer jcmd's unified interface — jcmd GC.heap_dump is the modern replacement for jmap -dump.",
      "The JVM has attach disabled (same limitation as jcmd)."
    ],
    "basics": [
      {
        "title": "Histogram of objects in the heap",
        "body": [
          "-histo counts instances and total size per class. The output is sorted by instance count or total size depending on the flag; -histo:live restricts to reachable objects."
        ],
        "code": "# Count and size of each class on the heap\njmap -histo:live <pid>\n\n# Limit to the top 30 by total size\njmap -histo:live <pid> | sort -k3 -n -r | head -30"
      },
      {
        "title": "Heap summary",
        "body": [
          "-heap prints a compact summary of the heap configuration and usage, plus a per-generation breakdown. Great first signal for 'is this thing out of heap'."
        ],
        "code": "jmap -heap <pid>"
      },
      {
        "title": "Capture a heap dump",
        "body": [
          "-dump writes a .hprof file you can open in Eclipse MAT. -dump:live only serializes reachable objects, making the dump smaller and usually the right choice."
        ],
        "code": "# Dump live heap to file\njmap -dump:live,file=/tmp/heap.hprof <pid>\n\n# Dump everything\njmap -dump:file=/tmp/heap-full.hprof <pid>"
      },
      {
        "title": "Process memory map",
        "body": [
          "-clstats and -finalizerinfo give class-loader statistics and pending finalizers; for the raw address map use the OS tools (pmap on Linux)."
        ],
        "code": "# Class-loader statistics\njmap -clstats <pid>\n\n# Pending finalizer info\njmap -finalizerinfo <pid>"
      }
    ],
    "quickstart": [
      {
        "title": "Fastest look + a dump",
        "body": [
          "In under a minute you get a histogram and a dump you can hand to MAT."
        ],
        "code": "jmap -histo:live <pid> | head -30\njmap -dump:live,file=/tmp/heap.hprof <pid>"
      }
    ],
    "faq": [
      {
        "q": "jmap vs jcmd GC.heap_dump — which is better?",
        "a": "jcmd GC.heap_dump is the modern, recommended path and works uniformly with other jcmd commands. jmap's -dump is functionally equivalent and perfectly fine. Use whichever you remember."
      },
      {
        "q": "Why do my -histo numbers differ between runs?",
        "a": "The heap changes between the point the count is taken and when you read it; GC can run between the object snapshot and the size computation. Treat -histo as a strong signal, not a precise audit."
      },
      {
        "q": "Can jmap cause pauses?",
        "a": "Capturing a heap dump is not free: the JVM must serialize the object graph, which can pause GC and raise memory pressure. Do it in a quiet window and prefer -dump:live to keep the dump smaller."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "jstack",
    "category": "jvm-cli",
    "toolSlug": "jstack",
    "h1": "jstack: Capture Thread Dumps for Hang & Deadlock Analysis",
    "metaTitle": "jstack examples: thread dumps, deadlocks, and lock analysis",
    "metaDescription": "jstack examples: dump thread stacks from a live JVM, find deadlocks and blocks, capture two-dump timing for hang analysis, and use the -l lock option.",
    "intro": [
      "jstack prints the Java stack traces of all threads in a running JVM. It is the essential tool for hang and deadlock investigations: when a service stops responding, a thread dump shows exactly where every thread is blocked, waiting on a lock, or spinning.",
      "The modern equivalent via jcmd is Thread.print; whichever you use, the investigation technique — take two or three dumps a few seconds apart and diff them — is what matters most."
    ],
    "useWhen": [
      "A service looks hung — take a thread dump and see what each thread is doing.",
      "You suspect a deadlock: jstack prints 'Found one Java-level deadlock' when it detects one.",
      "You need to know if threads are blocked on a monitor or waiting on a condition (matched with the -l option)."
    ],
    "avoidWhen": [
      "You need heap layout (use jmap or jcmd GC.heap_dump).",
      "You need ongoing profiling rather than a snapshot (use JFR/async-profiler)."
    ],
    "basics": [
      {
        "title": "Dump all threads",
        "body": [
          "Print the stack of every thread. Redirect to a file for repeated dumps you can diff."
        ],
        "code": "# Full dump to stdout\njstack <pid>\n\n# With lock info, to a file\njstack -l <pid> > threads-$(date +%s).txt\n\n# Same thing via jcmd\njcmd <pid> Thread.print -l"
      },
      {
        "title": "Detect deadlocks",
        "body": [
          "jstack automatically scans for cyclic lock waits and reports the implicated threads in its output."
        ],
        "code": "jstack <pid> | grep -A 10 -i 'deadlock'"
      },
      {
        "title": "Recommended hang-investigation cadence",
        "body": [
          "Take dumps a few seconds apart. If the same threads are stuck in the same frames across dumps, it is almost certainly a hang, not a transient wait."
        ],
        "code": "for i in 1 2 3; do\n  jstack <pid> > threads-$i.txt\n  sleep 5\ndone\ndiff <(cut -c1-120 threads-1.txt) <(cut -c1-120 threads-2.txt)"
      },
      {
        "title": "What a hung thread looks like",
        "body": [
          "Look for threads in RUNNABLE spinning in the same method, or WAITING/blocked on a monitor that is never released. HEAD of the stack is where the thread is now; the 'at' frames below show the call path."
        ]
      }
    ],
    "quickstart": [
      {
        "title": "Investigate a hang in 30 seconds",
        "body": [
          "Two dumps + a diff."
        ],
        "code": "jstack <pid> > t1.txt\nsleep 5\njstack <pid> > t2.txt\ndiff t1.txt t2.txt"
      }
    ],
    "faq": [
      {
        "q": "Hold on, do I use jstack or jcmd Thread.print?",
        "a": "Both produce thread dumps. jcmd Thread.print -l is the modern form and plays nicely with other jcmd commands. jstack remains fine and is heavily used in existing runbooks."
      },
      {
        "q": "Why take two dumps for a hang?",
        "a": "A single dump can catch a thread in a momentary wait. Two dumps seconds apart that agree are strong evidence the threads are genuinely stuck, not just momentarily paused."
      },
      {
        "q": "Can I read the dump without line numbers?",
        "a": "Running jstack -l and using a tool like TDA (Thread Dump Analyzer) or the thread-dump views in JMC/VisualVM makes large dumps far easier to scan."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "jstat",
    "category": "jvm-cli",
    "toolSlug": "jstat",
    "h1": "jstat: Live JVM Statistics for GC and Class-Loading",
    "metaTitle": "jstat examples: GC stats, class loading, and compilation rates",
    "metaDescription": "jstat examples: sample live GC counts and times, class-loading and JIT stats from a running JVM with -gcutil, -gc, -class and interval loops.",
    "intro": [
      "jstat prints live JVM statistics — garbage-collection counts and times, class-loading, and JIT-compilation rates — for a local JVM. Because it is command-line and cheap, it is ideal for sampling a process in a tight loop to see how the heap and collector are trending.",
      "The most useful invocations combine a statistic with an interval: the classic jstat -gcutil <pid> 1000 10 prints GC-utilization percentages every second for ten samples."
    ],
    "useWhen": [
      "You want a quick, scriptable check that a JVM is stabilizing (flat heap) or degrading (growing heap / rising GC time).",
      "You need to see live GC counts/times without enabling JMX or an agent.",
      "You want to sample class-loading or JIT activity over a window."
    ],
    "avoidWhen": [
      "You need event-level detail (GC reasons, allocation sites) — use JFR/JMC.",
      "The JVM is remote; jstat is for local processes (use jstatd or JMX for remote)."
    ],
    "basics": [
      {
        "title": "GC utilization over time",
        "body": [
          "-gcutil shows per-generation percentages. The classic loop: sample every second, 10 times. Rising S0/S1 and Old numbers with repeated full GCs say 'pressure'."
        ],
        "code": "# Every 1s, 10 samples\njstat -gcutil <pid> 1000 10"
      },
      {
        "title": "GC counts and times",
        "body": [
          "-gc adds raw counts and accumulated times for each event type. Columns ending in C/O/U are capacity/used; FGC/FGCT are full-GC count and total time."
        ],
        "code": "jstat -gc <pid> 1000 10"
      },
      {
        "title": "Class-loading and JIT stats",
        "body": [
          "-class shows loaded/unloaded classes; -compiler shows JIT start, compiled-method counts, and (on some JVMs) failed compilations."
        ],
        "code": "jstat -class <pid>\njstat -compiler <pid>"
      },
      {
        "title": "A watch loop for 'is it leaking?'",
        "body": [
          "Watch Old-gen usage trend steadily upward across many samples — a classic leak fingerprint. Combine with -gcutil."
        ],
        "code": "watch -n 5 \"jstat -gcutil <pid>\""
      }
    ],
    "quickstart": [
      {
        "title": "Confirm a JVM is healthy",
        "body": [
          "Sample GC utilization for 20 seconds and look for a stable, non-flatlining heap."
        ],
        "code": "jstat -gcutil <pid> 1000 20"
      }
    ],
    "faq": [
      {
        "q": "How do I read -gcutil columns?",
        "a": "S0/S1 = survivor space utilization %, E = Eden %, O = Old gen %, M = metaspace %, CCS = compressed class space %. YGC/YGCT = young GC count/total time, FGC/FGCT = full GC count/time, GCT = total GC time."
      },
      {
        "q": "jstat is empty or says the process is not a HotSpot VM — why?",
        "a": "jstat needs a HotSpot JVM and a local attach path. It cannot inspect OpenJ9/other VMs, and remote processes are out of scope (use jstatd or JMX)."
      },
      {
        "q": "What sample interval matters?",
        "a": "For trend detection use 5-10s intervals over minutes; for a live-debug snapshot use 1s. Intervals shorter than ~100ms can add noise and pressure."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "async-profiler",
    "category": "profiling",
    "toolSlug": "async-profiler",
    "h1": "async-profiler: Sampled CPU, Allocations and Flame Graphs",
    "metaTitle": "async-profiler tutorial: CPU and allocation flame graphs with examples",
    "metaDescription": "async-profiler tutorial: install, profile CPU and allocations, dump flame graphs, convert to JFR, and use it inside IntelliJ IDEA on any JVM.",
    "intro": [
      "async-profiler is the de-facto standard sampling profiler for the JVM. Unlike instrumenting profilers, it uses AsyncGetCallTrace and perf-event sampling to record stack traces without stopping the world, so overhead stays low even on hot production paths. It also produces the flame graphs famously used for CPU and allocation visualization.",
      "You can run it as a standalone agent (async-profiler -p <pid> ...), or use it inside flight-recorder integration and IntelliJ IDEA's bundled profiler, which wraps it."
    ],
    "useWhen": [
      "You need to find which methods actually consume CPU in a production-like workload.",
      "You want to see allocation sites and native stack frames (like JIT/GC related?) — async-profiler is one of the few profilers that captures native stacks cleanly.",
      "You want flame graphs without a commercial license or an instrumentation-based profiler."
    ],
    "avoidWhen": [
      "You need always-on continuous recording (prefer JFR, which is bundled and designed for that).",
      "You only need heap-leak 'dominators' (Eclipse MAT is the tool)."
    ],
    "basics": [
      {
        "title": "Download and check the agent",
        "body": [
          "The project ships prebuilt agents for common platforms. Managed profilers (IntelliJ, JMC) bundle an async-profiler agent for you."
        ],
        "code": "# Download release from GitHub releases (async-profiler-x.y-linux-x64.tar.gz)\ntar xzf async-profiler*.tar.gz\n./profiler.sh -v"
      },
      {
        "title": "Profile CPU for a fixed duration",
        "body": [
          "Record 30 seconds of CPU samples, then collect the flame graph HTML. -d is duration, -f is output file, -e cpu selects the event."
        ],
        "code": "# Profile the JVM with PID <pid> for 30s\n./profiler.sh -d 30 -f /tmp/flame.html -e cpu <pid>\n\n# Open /tmp/flame.html in a browser"
      },
      {
        "title": "Allocation profiling",
        "body": [
          "Switch the event to alloc to show allocation counts and sizes per call path (uses -Xint sampling by allocation)."
        ],
        "code": "./profiler.sh -d 30 -f /tmp/alloc.html -e alloc <pid>"
      },
      {
        "title": "Emit JFR-compatible output",
        "body": [
          "Generate a .jfr file you can open in JDK Mission Control as an alternative to the HTML flame graph."
        ],
        "code": "./profiler.sh -d 30 -o jfr -f /tmp/cpu.jfr <pid>"
      },
      {
        "title": "Use it inside IntelliJ IDEA",
        "body": [
          "IntelliJ's Run > 'Profile <main>' uses async-profiler under the hood and opens flame graphs in the IDE. This is the lowest-friction path for most developers."
        ]
      }
    ],
    "quickstart": [
      {
        "title": "First CPU flame graph in one command",
        "body": [
          "Point it at a running JVM and open the result."
        ],
        "code": "# In the async-profiler directory\n./profiler.sh -d 30 -f ~/flame.html -e cpu <pid>\nopen ~/flame.html"
      }
    ],
    "faq": [
      {
        "q": "Where is async-profiler bundled so I don't download it?",
        "a": "IntelliJ IDEA's built-in profiler, JetBrains Runtime tools, and several APM products package async-profiler. If you manage a plain JDK, download the release tarball or use your package manager (many distros ship 'async-profiler')."
      },
      {
        "q": "CPU vs allocation profiling — when?",
        "a": "CPU profiling answers 'where does the time go' for hot loops and steady-state workloads. Allocation profiling answers 'where do objects come from' and is the first stop for GC-pressure/leak suspects."
      },
      {
        "q": "Does async-profiler work on containerized/k8s JVMs?",
        "a": "Yes — attach by PID works as long as you run it in the same container/namespace as the JVM (or the host can reach /proc/<pid>). On cgroup-limited environments, ensure /proc and perf permissions are available."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "visualvm",
    "category": "profiling",
    "toolSlug": "visualvm",
    "h1": "VisualVM: All-in-One Monitoring, Thread & Heap Analysis",
    "metaTitle": "VisualVM tutorial: monitor, profile and analyze heap+thread dumps",
    "metaDescription": "VisualVM tutorial: attach to local/remote JVMs, view heap and GC charts, take and open thread dumps, and do basic CPU/memory sampling.",
    "intro": [
      "VisualVM is a visual tool that bundles many JDK diagnostics into one GUI: live heap and GC charts, CPU/memory sampling, thread and heap dump viewing, and JFR/GC-log analysis. It historically shipped with the JDK and remains popular because it needs no agent and covers the common diagnostics in one window.",
      "Since JDK 9 the JDK no longer bundles VisualVM, but the standalone build (from visualvm.github.io) is free and connects to local and remote JVMs over the attach mechanism or JMX."
    ],
    "useWhen": [
      "You want a zero-agent GUI that monitors local JVMs and opens thread/heap dumps.",
      "You want quick CPU or memory sampling without installing another profiler.",
      "You're exploring a heap dump or thread dump quickly before going deep in MAT."
    ],
    "avoidWhen": [
      "You need deep production CPU profiles with native stacks — prefer async-profiler.",
      "You need fine-grained memory-leak dominators — Eclipse MAT is stronger."
    ],
    "basics": [
      {
        "title": "Launch and attach",
        "body": [
          "Install from the website, then launch. The 'Local' tree lists attachable JVMs on the same machine; 'Remote' nodes connect via jstatd or JMX."
        ],
        "code": "# Start VisualVM (from the unpacked directory)\n./bin/visualvm"
      },
      {
        "title": "Monitor overview charts",
        "body": [
          "The Monitor tab shows live heap, metaspace, classes, and thread counts, plus CPU usage. This is the fastest 'is my JVM healthy' view."
        ]
      },
      {
        "title": "Take a thread dump",
        "body": [
          "Right-click a process and choose Thread Dump; VisualVM opens it in a tree with expandable stack frames. Save as .txt for sharing."
        ]
      },
      {
        "title": "Take / open a heap dump",
        "body": [
          "Right-click -> Heap Dump captures a .hprof and opens it: browse instances, run a basic leak-suspect scan, and query with the built-in OQL console."
        ]
      },
      {
        "title": "Sampling vs profiling tab",
        "body": [
          "The Profiler tab lets you start CPU or Memory sampling on a live process, then shows hot methods / allocation counts per class."
        ]
      }
    ],
    "quickstart": [
      {
        "title": "Monitor + a thread dump in a minute",
        "body": [
          "Launch, attach, and grab a dump."
        ],
        "code": "./bin/visualvm\n# File > Add JMX Connection or click a process under Local"
      }
    ],
    "faq": [
      {
        "q": "Is VisualVM still maintained?",
        "a": "Yes — the open-source project releases regularly from visualvm.github.io. It is the community-maintained successor to the JDK-bundled tool and works with current JDKs."
      },
      {
        "q": "VisualVM vs JMC vs async-profiler?",
        "a": "VisualVM = quick all-in-one monitoring + dump viewing. JMC = deep analysis of JFR recordings and live processes. async-profiler = raw sampling flame graphs. They overlap but each has a strength; many teams keep VisualVM for day-to-day and JMC for JFR."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "jmc",
    "category": "profiling",
    "toolSlug": "jmc",
    "h1": "JDK Mission Control (JMC): Analyze JFR Recordings & Live JVMs",
    "metaTitle": "JDK Mission Control tutorial: read JFR recordings, flame graphs, lock & GC views",
    "metaDescription": "JDK Mission Control tutorial: open and analyze JFR .jfr files, flame graphs, allocation, lock and GC pause views, and connect to live JVMs.",
    "intro": [
      "JDK Mission Control (JMC) is the rich analysis client for Java Flight Recorder data. It opens .jfr recordings and shows flame graphs, allocation and lock profiles, GC pause timelines, and exception/latency breakdowns — turning raw JFR events into a decision-ready view.",
      "JMC also connects to live JVMs via JMX and has long been the standard way to make sense of the 'black box' JFR produces in production."
    ],
    "useWhen": [
      "You have a .jfr recording (from jcmd JFR.start or -XX:StartFlightRecording) and need to analyze it.",
      "You want flame graphs, GC pause views, and lock/allocation analysis on JFR data.",
      "You need to inspect a live JVM via JMX with charts and triggers."
    ],
    "avoidWhen": [
      "You haven't got an agent-free quick look — VisualVM connects with fewer moving parts if all you need is a monitor.",
      "You need Java-stack sampling only for a release investigation — async-profiler might fit better."
    ],
    "basics": [
      {
        "title": "Open a recording",
        "body": [
          "Launch JMC and open a .jfr file; the automated analysis gives a prioritized list of findings (e.g., long GC pauses, lock contention) plus manual views."
        ],
        "code": "# Launch JMC (bundled with Oracle JDK or from the openjdk/jmc releases)\njmc"
      },
      {
        "title": "Flame view",
        "body": [
          "The Flame View renders the sampled stack top-down so you can see where CPU or allocations concentrate across the whole recording."
        ]
      },
      {
        "title": "GC pause view",
        "body": [
          "The Garbage Collection view plots pause duration and heap used over time — quickly spot stop-the-world spikes and their cause (young vs old GC, concurrent phases)."
        ]
      },
      {
        "title": "Lock & exceptions",
        "body": [
          "JFR's latency/lock events are surfaced as contention and object-wait analysis plus exception breakdowns, helping you find blocked threads and hot exceptions."
        ]
      },
      {
        "title": "Trend across recordings",
        "body": [
          "JMC has an automated analysis report that compares findings; use it as the first read of any new recording."
        ]
      }
    ],
    "quickstart": [
      {
        "title": "Record then analyze",
        "body": [
          "Capture a JFR file from a live JVM and open it in JMC."
        ],
        "code": "jcmd <pid> JFR.start duration=60s filename=/tmp/app.jfr\njmc /tmp/app.jfr"
      }
    ],
    "faq": [
      {
        "q": "Is JMC free?",
        "a": "Yes. The openjdk/jmc project is open source and the Oracle JDK ships it; standalone builds are available from the project's GitHub releases for any JDK."
      },
      {
        "q": "JMC without JFR?",
        "a": "JMC has JMX connection features too, but its headline value is JFR analysis. If you have no JFR recording, start one with jcmd JFR.start."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "eclipse-mat",
    "category": "memory",
    "toolSlug": "eclipse-mat",
    "h1": "Eclipse MAT: Find Memory Leaks in Java Heap Dumps",
    "metaTitle": "Eclipse MAT tutorial: leaks suspect, dominators, OQL, path to GC roots",
    "metaDescription": "Eclipse MAT tutorial: load a heap dump, run the Leak Suspects report, use the Dominator Tree and OQL, and find what holds objects to GC roots.",
    "intro": [
      "Eclipse Memory Analyzer (MAT) is the standard tool for analyzing Java heap dumps. Its headline artifacts are two reports — the Leak Suspects overview and the Dominator Tree — that together tell you which objects suck up memory and what is anchoring them to the GC roots.",
      "You feed it a .hprof dump (from jmap -dump:live or jcmd GC.heap_dump) and its size-of and dominator calculations quickly separate 'huge legitimate cache' from 'objects that should have been freed'. OQL lets you write queries when the reports aren't enough."
    ],
    "useWhen": [
      "You have an OutOfMemoryError or a steadily-growing Old-gen and need to find the culprit.",
      "You want to quantify what individual class instances actually cost (shallow vs retained size).",
      "You want to see the path from a GC root to a big object ('why is this still reachable')."
    ],
    "avoidWhen": [
      "You need a live-heap histogram only — jmap -histo or jcmd snippets are faster.",
      "Your problem is GC *behavior* rather than a stale object graph — GC log analysis is the tool."
    ],
    "basics": [
      {
        "title": "Capture a dump and open it",
        "body": [
          "MAT consumes standard .hprof dumps. Capture with jmap or jcmd, launch MAT, and File > Open Heap Dump."
        ],
        "code": "jcmd <pid> GC.heap_dump /tmp/heap.hprof\n# or\njmap -dump:live,file=/tmp/heap.hprof <pid>"
      },
      {
        "title": "Leak Suspects report",
        "body": [
          "MAT's Overview runs an automated Leak Suspects analysis listing the top 'suspects' — big accumulations with their GC-root path. Start here on any dump."
        ]
      },
      {
        "title": "Dominator Tree vs Histogram",
        "body": [
          "Histogram (class-by-class counts/sizes) is a first scan. The Dominator Tree shows retained-size dominance — which objects, if freed, would free the most memory. Switch between them with the toolbar."
        ]
      },
      {
        "title": "Path to GC Roots",
        "body": [
          "For any object, right-click to see the path from a GC root. This answers 'why is this still alive' — classic causes are static collections, ThreadLocal, listener registries, and Caches with long TTLs."
        ]
      },
      {
        "title": "OQL for custom queries",
        "body": [
          "OQL (Object Query Language) is SQL-like. SELECT * FROM instanceof java.lang.String, or filter instances of your own classes."
        ],
        "code": "SELECT * FROM java.util.ArrayList\nSELECT sum(o.@retainedHeapSize) FROM instanceof com.example.CacheEntry o"
      }
    ],
    "quickstart": [
      {
        "title": "From dump to suspect in 3 clicks",
        "body": [
          "Open the dump and read the automated overview."
        ],
        "code": "# 1) capture\njcmd <pid> GC.heap_dump /tmp/heap.hprof\n# 2) open in MAT\n# 3) Overview > Leak Suspects"
      }
    ],
    "faq": [
      {
        "q": "Shallow vs retained size?",
        "a": "Shallow size is the object's own footprint (header + fields). Retained size is what would be freed if this object (and its exclusively-reachable children) were collected. Retained size is what leaks analysis cares about."
      },
      {
        "q": "Dump too big / parsing timeout?",
        "a": "MAT can run out of heap parsing huge dumps itself. Increase MAT's -Xmx (e.g., edit MemoryAnalyzer.ini to -Xmx8g) and prefer -dump:live (smaller) dumps for leak searches."
      },
      {
        "q": "MAT vs VisualVM heap dump?",
        "a": "VisualVM opens dumps for quick instance browsing; MAT is purpose-built for leak/dominance analysis with retained sizes. Use MAT for real forensics."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "gc-log-analysis",
    "category": "memory",
    "toolSlug": "gcviewer",
    "h1": "GC Log Analysis: Read JVM Garbage-Collection Logs with GCViewer & gceasy",
    "metaTitle": "GC log analysis guide: enable GC logs, read -Xlog:gc, use GCViewer and gceasy",
    "metaDescription": "GC log analysis guide: enable GC logging on modern JDKs, read -Xlog:gc output, and analyze pause/throughput with GCViewer and gceasy.",
    "intro": [
      "When a JVM shows excessive GC time or long pauses, the GC log is where the evidence lives. On modern JDKs (9+) GC logging is enabled with -Xlog, and the output can be graphed with GCViewer (a small Java tool) or uploaded to gceasy for an annotated report.",
      "GC log analysis answers two questions: 'how much time is spent collecting' (throughput) and 'how long are individual pauses' (latency). That pairing is what tells you whether to change heap size, switch collectors (G1/ZGC/Shenandoah), or fix an allocation pattern."
    ],
    "useWhen": [
      "You see rising response-time percentiles and suspect GC pauses.",
      "You want to quantify GC throughput and p99 pauses over a window.",
      "You are comparing heap sizes or collector choices and want a numeric before/after."
    ],
    "avoidWhen": [
      "Your issue is a stale heap (leak), not GC behavior — heap-dump analysis is the tool."
    ],
    "basics": [
      {
        "title": "Enable GC logging (JDK 9+)",
        "body": [
          "Use a Unified Logging -Xlog tag selector. A common production setting writes to a rolling file with rotation and includes the GC timestamps and safe-point info."
        ],
        "code": "java -Xlog:gc*,gc+metaspace,gc+ref=info:file=gc.log:time,uptime,level,tags -jar app.jar"
      },
      {
        "title": "Enable GC logging (JDK 8)",
        "body": [
          "Older style, still valid: -XX:+PrintGCDetails with timestamps and dates."
        ],
        "code": "java -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log -jar app.jar"
      },
      {
        "title": "Read the raw log",
        "body": [
          "Each GC line shows a pause (Pause Young / Pause Full), heap before->after, and the GC cause or reason. Look for frequent Full GCs and long 'Pause Full (Allocation Failure)' entries."
        ],
        "code": "# Show the line type breakdown\ngrep -Eo 'Pause (Young|Full)[^]]*' gc.log | sort | uniq -c | sort -rn"
      },
      {
        "title": "Analyze with GCViewer",
        "body": [
          "Open the .log in GCViewer for charts of pause time, heap usage and throughput, plus summary metrics like total pauses and max pause. Great when you have an offline log."
        ]
      },
      {
        "title": "Analyze with gceasy",
        "body": [
          "Upload a GC log to gceasy.io for an instant, annotated report: GC throughput %, worst GC pause, GC heap usage trends, and tuning hints — no local install."
        ]
      }
    ],
    "quickstart": [
      {
        "title": "Minimal comparison run",
        "body": [
          "Capture a log, read the two numbers that matter the most."
        ],
        "code": "java -Xlog:gc=info:file=gc.log -jar app.jar\n# then\ngrep -E 'Pause (Full|Young)' gc.log | wc -l"
      }
    ],
    "faq": [
      {
        "q": "What does GC throughput of 99% mean?",
        "a": "Throughput = (wall time - GC pause time) / wall time. 99% means 1% of time was paused; below ~97% starts to hurt p99 latency. It answers 'how much time is wasted' not 'are pauses noticeable'."
      },
      {
        "q": "Modern collector to try for low latency?",
        "a": "ZGC and Shenandoah target sub-millisecond pauses at the cost of some throughput. If GC pressure is allocation-driven, G1 well-tuned usually suffices; measure before switching."
      },
      {
        "q": "My log shows constant Full GCs — what next?",
        "a": "Check the heap after each Full GC: if it keeps growing to near max before each collection, look for a leak (heap dump + MAT). If it returns to a low baseline but still Full GCs often, the heap is too small — raise -Xmx or tune G1."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "byte-buddy",
    "category": "bytecode",
    "toolSlug": "byte-buddy",
    "h1": "Byte Buddy: Runtime Class Generation & Proxies",
    "metaTitle": "Byte Buddy tutorial: generate classes and proxies at runtime with Java",
    "metaDescription": "Byte Buddy tutorial: create dynamic proxies and classes at runtime, intercept methods, and understand when it beats raw ASM.",
    "intro": [
      "Byte Buddy is the modern, high-level library for generating and transforming Java classes at runtime. Its fluent API lets you describe 'a class that intercepts method X with logic Y' in readable Java, and it compiles that to bytecode — without you touching opcodes.",
      "It sits on top of ASM but raises the ergonomics enormously, which is why it underlies mocking (Mockito), APM agents, and ORM providers. Use Byte Buddy when you need dynamic proxies, interceptors, or generated types and do not want to hand-write bytecode."
    ],
    "useWhen": [
      "You need runtime proxies or to intercept method calls in your own library.",
      "You're building an agent that instruments classes (the Byte Buddy agent is a thin but complete wrapper).",
      "You want reliable runtime class generation without writing ASM by hand."
    ],
    "avoidWhen": [
      "You only want a few proxies — consider the JDK's built-in java.lang.reflect.Proxy for interface proxies.",
      "You must hand-optimize generated bytecode tightly — raw ASM gives more control but more code."
    ],
    "basics": [
      {
        "title": "Add the dependency",
        "body": [
          "Byte Buddy is on Maven Central. Use stub jars (net.bytebuddy:byte-buddy-agent) or the single jar; for agents you'll also want byte-buddy-agent."
        ],
        "code": "// Maven\n<dependency>\n  <groupId>net.bytebuddy</groupId>\n  <artifactId>byte-buddy</artifactId>\n  <version>1.14.19</version>\n</dependency>"
      },
      {
        "title": "A first generated class",
        "body": [
          "The canonical \"Hello World\" of Byte Buddy: define a class, define a method, and call through reflection or a loaded class."
        ],
        "code": "Class<?> loaded = new ByteBuddy()\n  .subclass(Object.class)\n  .method(ElementMatchers.named(\"toString\"))\n  .intercept(FixedValue.value(\"Hello from Byte Buddy\"))\n  .make()\n  .load(getClass().getClassLoader())\n  .getLoaded();\n\nObject o = loaded.getDeclaredConstructor().newInstance();\nSystem.out.println(o); // prints: Hello from Byte Buddy"
      },
      {
        "title": "Method interception with arguments",
        "body": [
          "Use MethodDelegation to route calls to a plain Java interceptor that reads the arguments — the pattern behind proxies, decorators and AOP."
        ],
        "code": "class Interceptor {\n  static String greet(@AllArguments Object[] args) {\n    return \"hi \" + args[0];\n  }\n}\n\nClass<?> proxy = new ByteBuddy()\n  .subclass(Service.class)\n  .method(ElementMatchers.named(\"greet\"))\n  .intercept(MethodDelegation.to(Interceptor.class))\n  .make().load(getClass().getClassLoader()).getLoaded();"
      },
      {
        "title": "Premain agent for instrumentation",
        "body": [
          "To instrument classes at load time (agent use case), the byte-buddy-agent artifact provides a premain that wires Byte Buddy to transform classes on load."
        ],
        "code": "public static void premain(String arg, Instrumentation inst) {\n  new AgentBuilder.Default()\n    .type(ElementMatchers.nameStartsWith(\"com.example.\"))\n    .transform((b, type, cl, m, pd) ->\n       b.method(ElementMatchers.any()).intercept(\n         Advice.to(MyAdvice.class)))\n    .installOn(inst);\n}"
      }
    ],
    "quickstart": [
      {
        "title": "Proxied method in ten lines",
        "body": [
          "Subclass, intercept by name, call it."
        ],
        "code": "Class<?> proxy = new ByteBuddy()\n  .subclass(Service.class)\n  .method(ElementMatchers.named(\"greet\"))\n  .intercept(MethodDelegation.to(Interceptor.class))\n  .make().load(getClass().getClassLoader()).getLoaded();\nSystem.out.println(((Service)proxy.newInstance()).greet(\"world\"));"
      }
    ],
    "faq": [
      {
        "q": "Byte Buddy vs raw ASM?",
        "a": "Byte Buddy wraps ASM and adds a fluent API, automatic generation of correctly balanced code, and helper advice via annotations. You still drop to ASM when you need maximum control or micro-optimized bytecode; most dynamic-proxy workloads never need to."
      },
      {
        "q": "Does Byte Buddy support Java 21+?",
        "a": "Yes — it tracks current JDK releases with a monthly cadence. The latest versions support record classes, sealed types, and virtual threads."
      },
      {
        "q": "Why use it instead of JDK Proxy?",
        "a": "JDK Proxy only proxies interfaces and requires an invocation handler per call. Byte Buddy subclasses concrete classes, generates code optimized per interception point, and supports agents — giving better performance and more flexibility."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "maven-vs-gradle",
    "category": "build",
    "toolSlug": "gradle",
    "h1": "Maven vs Gradle: How to Choose a JVM Build Tool",
    "metaTitle": "Maven vs Gradle: differences, performance, and how to choose",
    "metaDescription": "Maven vs Gradle compared: XML vs Groovy/Kotlin DSL, convention vs flexibility, incremental builds, dependency caching, and which to pick for your project.",
    "intro": [
      "Maven and Gradle dominate JVM builds. Maven is the battle-tested convention-over-configuration workhorse with a massive plugin ecosystem and predictable XML POMs. Gradle offers more flexibility and generally faster incremental builds via a Groovy or Kotlin DSL, plus first-class handling of multi-module and Android projects.",
      "The choice is rarely 'which is technically better' — it's 'what does your team and ecosystem standardize on.' This page gives you the decision factors and the honest trade-offs, with pointers to the real command-line tools you will use."
    ],
    "useWhen": [
      "Maven: your team values strict conventions, stable plugin behavior, and a widely understood format; or you must integrate with enterprise tooling that assumes Maven.",
      "Gradle: you need incremental build speed, custom build logic, multi-module builds, or Android; or you prefer a programmatic (DSL) rather than declarative build."
    ],
    "avoidWhen": [
      "You want the absolute simplest possible build — look at JBang or the JDK's source-file mode before pulling in a full build system."
    ],
    "basics": [
      {
        "title": "Core commands side by side",
        "body": [
          "Both tools expose familiar lifecycle-equivalent commands; the ergonomics differ only in syntax."
        ],
        "code": "# Maven\nmvn clean test\nmvn package\nmvn dependency:tree\n\n# Gradle\n./gradlew test\n./gradlew build\n./gradlew dependencies"
      },
      {
        "title": "Configuration: POM XML vs Groovy/Kotlin DSL",
        "body": [
          "Maven expresses builds declaratively in pom.xml. Gradle expresses them programmatically, so custom logic, conditionals, and plugins read like code and are easier to compose."
        ],
        "code": "<!-- pom.xml -->\n<dependency>\n  <groupId>org.junit.jupiter</groupId>\n  <artifactId>junit-jupiter</artifactId>\n  <version>5.10.2</version>\n  <scope>test</scope>\n</dependency>"
      },
      {
        "title": "Performance: why Gradle is usually faster",
        "body": [
          "Gradle caches task outputs and supports incremental builds and build caching out of the box, so re-runs skip unchanged work. Maven re-executes by default unless you add caching, though a good Maven profile is still fine for CI."
        ]
      },
      {
        "title": "Speed vs predictability",
        "body": [
          "That flexibility cuts both ways: Gradle builds can become hard to reason about at scale, while Maven's conventions keep projects boringly predictable. Choose the one that matches the team's risk tolerance."
        ]
      }
    ],
    "quickstart": [
      {
        "title": "Initialize a project",
        "body": [
          "Both make it easy to scaffold."
        ],
        "code": "# Maven\nmvn archetype:generate -DgroupId=com.example -DartifactId=demo\n\n# Gradle\ngradle init --type java-application"
      }
    ],
    "faq": [
      {
        "q": "Which is faster for CI?",
        "a": "Gradle generally wins on incremental and parallel builds and has built-in build/output caching across machines. For tiny single-module projects the difference is negligible."
      },
      {
        "q": "Can a project use both?",
        "a": "It's rare and usually a migration state. The practical answer: pick one and standardize; both resolve dependencies from Maven Central and can consume the other's published artifacts."
      },
      {
        "q": "Is Maven dying?",
        "a": "No. Maven remains the enterprise default and its plugin ecosystem is enormous. Gradle is dominant for Android and many modern open-source projects, but 'boring and predictable' keeps Maven very much alive."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "asm",
    "category": "bytecode",
    "toolSlug": "asm",
    "h1": "ASM: Read and Rewrite Java Bytecode",
    "metaTitle": "ASM tutorial: read, analyze and rewrite class file bytecode",
    "metaDescription": "ASM tutorial: the low-level bytecode library used across the JVM ecosystem — read class files, generate method code, and transform loaded classes.",
    "intro": [
      "ASM is the bedrock bytecode library on the JVM — the JDK itself uses it internally, as do countless frameworks and APM agents. It reads .class files event-by-event and lets you emit or modify bytecode directly with a tiny footprint and zero dependencies.",
      "Where Byte Buddy gives you a fluent high-level API, ASM gives you the opcodes. It is the right tool when you need precise, fast class rewriting or code generation and can tolerate writing the lower-level visitors."
    ],
    "useWhen": [
      "You need to modify class files at build time or load time (agents, build plugins).",
      "You're generating small, tight bytecode and want full control over each instruction.",
      "You want to analyze class structure (methods, fields, annotations) programmatically."
    ],
    "avoidWhen": [
      "You want a readable, high-level API for dynamic proxies — Byte Buddy is friendlier."
    ],
    "basics": [
      {
        "title": "Read a class with a ClassReader",
        "body": [
          "Crucial for bytecode understanding: visit methods and print the disassembly. The tree API (ClassNode) is more convenient for most rewriting than the event visitor API."
        ],
        "code": "ClassReader cr = new ClassReader(inputStream);\nClassNode cn = new ClassNode();\ncr.accept(cn, 0);                       // parse\nfor (MethodNode m : cn.methods) {\n  System.out.println(m.name + m.desc);  // descriptor = signature\n}"
      },
      {
        "title": "Generate a method with a ClassWriter",
        "body": [
          "Emit instructions with the visitor pattern. ASM provides an mnemonics helper (MathOps, InsnList) so opcodes are typed rather than raw bytes."
        ],
        "code": "ClassWriter cw = new ClassWriter(0);\ncw.visit(Opcodes.V1_8, ACC_PUBLIC, \"com/example/Hello\",\n         null, \"java/lang/Object\", null);\nMethodVisitor mv = cw.visitMethod(ACC_PUBLIC, \"run\", \"()V\", null, null);\nmv.visitCode();\nmv.visitInsn(RETURN);\nmv.visitMaxs(0, 1);\nmv.visitEnd();\nbyte[] bytes = cw.toByteArray();"
      },
      {
        "title": "Transform on load with a Java agent",
        "body": [
          "Use a ClassFileTransformer in a premain to rewrite bytes for every matching class loaded by the JVM — the hook ASM-based agents use to instrument applications."
        ],
        "code": "public byte[] transform(Module mod, ClassLoader cl,\n    String name, Class<?> cf, ProtectionDomain pd, byte[] bytes) {\n  if (!name.startsWith(\"com/example/\")) return bytes;\n  ClassReader cr = new ClassReader(bytes);\n  ClassWriter cw = new ClassWriter(0);\n  cr.accept(new MyClassVisitor(cw), 0);\n  return cw.toByteArray();\n}"
      }
    ],
    "quickstart": [
      {
        "title": "Disassemble any class",
        "body": [
          "Read and dump the constant pool and instructions."
        ],
        "code": "ClassNode cn = new ClassNode();\nnew ClassReader(bytes).accept(cn, 0);\nSystem.out.println(cn.name);\ncn.methods.forEach(m -> System.out.println(m.name + m.desc));"
      }
    ],
    "faq": [
      {
        "q": "ASM vs Byte Buddy?",
        "a": "Byte Buddy is built on ASM. Use Byte Buddy for dynamic proxies and ergonomic code generation; use ASM directly for maximal control, minimal footprint, or when you're instrumenting at the instruction level."
      },
      {
        "q": "Does ASM keep up with new JDKs?",
        "a": "Yes — new ASM versions support each new class-file version, including records, sealed classes, pattern matching, and virtual-thread-related updates. Match the ASM major version to your class-file target."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "jmh",
    "category": "testing",
    "toolSlug": "jmh",
    "h1": "JMH: Write Correct Java Microbenchmarks",
    "metaTitle": "JMH tutorial: microbenchmark Java code without JIT pitfalls",
    "metaDescription": "JMH tutorial: set up, write and run correct microbenchmarks, avoid JIT dead-code elimination and warm-up traps, and read the results.",
    "intro": [
      "JMH (Java Microbenchmark Harness) is the OpenJDK project's tool for writing correct microbenchmarks. Reasoning about JVM performance by hand is hopeless — the JIT compiles, inlines, and eliminated code, and naive stopwatch loops get optimized to nothing. JMH handles warm-up, dead-code elimination, black-holes, and forking so your numbers mean something.",
      "It runs from a standalone right-jar or via Maven/Gradle plugins. The golden rules: black-hole every result, warm up genuinely, and never draw conclusions you didn't measure."
    ],
    "useWhen": [
      "You need a trustworthy number for a hot code path or an algorithm comparison.",
      "You're choosing between two implementations and want an apples-to-apples measurement.",
      "You want to regression-test performance (speed compiler optimizations into CI)."
    ],
    "avoidWhen": [
      "You need throughput under real concurrency/load — that's a load test (Gatling/k6), not a microbenchmark.",
      "You just need to know which method is hot in a big app — profile with async-profiler instead."
    ],
    "basics": [
      {
        "title": "Scaffold a benchmark",
        "body": [
          "JMH best works as a separate module or even a standalone main. The maven archetype is the fastest start."
        ],
        "code": "mvn archetype:generate \\\n  -DarchetypeGroupId=org.openjdk.jmh \\\n  -DarchetypeArtifactId=jmh-java-11-archetype \\\n  -DgroupId=com.example -DartifactId=bench"
      },
      {
        "title": "A minimal benchmark",
        "body": [
          "Annotate methods with @Benchmark. Use a Blackhole to consume results so the JIT cannot void them."
        ],
        "code": "@Benchmark\n@BenchmarkMode(Mode.Throughput)\n@Fork(2)\n@Warmup(iterations = 3, time = 1)\n@Measurement(iterations = 5, time = 1)\npublic void sumLoop(Blackhole bh) {\n  long acc = 0;\n  for (int i = 0; i < 1000; i++) acc += i;\n  bh.consume(acc);\n}"
      },
      {
        "title": "Run and read",
        "body": [
          "Run via the class with main (each @Benchmark is a separate measurement set). The output prints a score with the chosen Mode and unit (e.g., ops/ns for Throughput)."
        ],
        "code": "mvn package\njava -jar target/benchmarks.jar"
      },
      {
        "title": "Blackhole — the rule you can't skip",
        "body": [
          "A plain loop that returns nothing or whose result is unused is dead code the JIT removes. blackhole.consume(x) forces the result to be observed, and blackhole.consumeCPU(int) burns time to shape loop bodies without producing observable values."
        ]
      }
    ],
    "quickstart": [
      {
        "title": "Measure a tiny method",
        "body": [
          "Write, build, run."
        ],
        "code": "@Benchmark public void twice(Blackhole bh) {\n  bh.consume(computeDouble());\n}\n\njava -jar target/benchmarks.jar"
      }
    ],
    "faq": [
      {
        "q": "Why is my naive loop showing zero time?",
        "a": "The JIT detected the computation has no side effects and eliminated it. That's precisely why JMH forces you to consume results with a Blackhole — otherwise the benchmark measures nothing."
      },
      {
        "q": "What do forks, warmup, measurement mean?",
        "a": "Fork runs the benchmark in a fresh JVM (isolating JIT state). Warmup iterates untouched samples to let the JIT settle before timing. Measurement timing runs follow. The defaults are good; change them when you need higher variance control."
      },
      {
        "q": "Should every project microbenchmark?",
        "a": "No — microbenchmarks are for hot, stable, isolated code. For whole-app performance use a profiler, then microbenchmark only the identified hotspots."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "jvm-tuning-kubernetes",
    "category": "kubernetes",
    "toolSlug": "container-awareness",
    "h1": "JVM Tuning Best Practices in Kubernetes",
    "metaTitle": "JVM Tuning Best Practices in Kubernetes: Heap, GC, Limits & Flags",
    "metaDescription": "Best practices for tuning the JVM in Kubernetes pods: -Xmx sizing vs pod limits, MaxRAMPercentage, GC choice, container awareness, JFR and Prometheus monitoring.",
    "intro": [
      "Kubernetes changes the JVM tuning job. A JVM pod is not a server you control — it is a cgroup-capped process that can be rescheduled, restarted and scaled at will. Set memory wrong and Kubernetes kills the pod; set CPU lazy and you leave capacity idle while paying for it.",
      "This guide covers the practical, repeatable rules for running Java in Kubernetes: how modern JDKs read container limits, how to size -Xmx (or better MaxRAMPercentage) against the pod memory limit, how to pick a garbage collector per workload, and how to get diagnostics out of a pod without redeploying.",
      "It is general, distribution-agnostic guidance — it applies whether you run OpenJDK, Temurin, Amazon Corretto, Zulu or GraalVM on any k8s platform."
    ],
    "useWhen": [
      "You are containerizing an existing Java service and want it to stop getting OOMKilled at startup or under load",
      "You are deciding on -Xmx vs MaxRAMPercentage and memory requests/limits for a new JVM workload",
      "You need to choose a GC — G1, ZGC, Shenandoah or Parallel — for latency- vs throughput-sensitive pods",
      "You want to capture diagnostics (JFR, Prometheus metrics, heap dumps) from ephemeral pods without a redeploy"
    ],
    "avoidWhen": [
      "You are tuning a long-lived, single-machine JVM that always sees all the host's RAM and CPU",
      "You only need a correct memory request and a default JDK is already behaving well — don't over-flag",
      "Your pods already set precise fixed flags and you are looking for a broader architecture question, not a tuning rule"
    ],
    "basics": [
      {
        "title": "1. Let the JVM see the container's limits (Container Awareness)",
        "body": [
          "Since JDK 8u191 and Java 10, the JVM reads cgroup limits automatically via -XX:+UseContainerSupport (on by default in Java 10+). It sizes the max heap and defaults from the container's memory limit, not the host's total RAM — so a 512Mi pod limit on a 32Gi host does not get an 8Gi heap it was never allowed to use.",
          "Verify it is active by checking the effective flag in the running JVM: jcmd <pid> VM.flags | grep UseContainerSupport, or run -XshowSettings:vm -version and read the 'max heap size' line against your pod's limit.",
          "Do not guess the container's RAM: use the percentage flags instead of a hard -Xmx. The lineage of the JDK matters — Temurin/OpenJDK, Corretto, Zulu and GraalVM all enable container support, but each ships its own defaults and patch levels."
        ],
        "code": "# Confirm container awareness is on and see the computed max heap\n# (run inside the pod against a live PID)\nkubectl exec deploy/myapp -- sh -c 'jcmd $(pgrep -f MainClass) VM.flags | grep -i container'\n\n# See what the JVM believes the available memory is\nkubectl exec deploy/myapp -- java -XshowSettings:vm -version"
      },
      {
        "title": "2. Size memory: prefer MaxRAMPercentage over a fixed -Xmx",
        "body": [
          "The single most important rule: size the heap against the container's memory limit, leaving room for the JVM's metaspace, thread stacks, JIT code cache and off-heap buffers. A hard -Xmx that ignores the pod limit is how pods get OOMKilled the moment traffic spikes.",
          "With -XX:MaxRAMPercentage=75 and a pod memory limit of 1Gi, the JVM sizes its max heap to ~768Mi automatically, leaving ~256Mi for native overhead. The same manifest scaled to a 4Gi limit scales the heap proportionally — no edit needed.",
          "Reserve enough headroom for native memory: 25% is a common cushion, but account for off-heap buffers (Netty direct memory, Hazelcast, Lucene), JNI, or thread stacks. The JVM's overhead is roughly metaspace + code cache + thread stacks + GC structures; peak native usage often exceeds a naive guess.",
          "If you must use a fixed value (some frameworks/OSGi want one), set it through the pod env (JAVA_OPTS or an env-var-backed entrypoint), never baked into the image with no coupling to the request/limit."
        ],
        "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: myapp\nspec:\n  template:\n    spec:\n      containers:\n      - name: app\n        image: temurin:21-jre\n        command: [\"java\"]\n        args:\n          - \"-XX:MaxRAMPercentage=75\"\n          - \"-XX:ActiveProcessorCount=2\"\n          - \"-jar\", \"app.jar\"\n        resources:\n          requests:\n            memory: \"512Mi\"\n            cpu: \"500m\"\n          limits:\n            memory: \"1Gi\"   # heap gets 75% of this"
      },
      {
        "title": "3. Request and limit memory deliberately; use ratio flags, not absolutes",
        "body": [
          "Set both requests and limits, and never let the limit silently drive heap sizing alone. The request is what the scheduler reserves and what HPA reads; the limit is the cgroup cap. If limit equals request, the pod is hard-pinned to that budget and gives the JVM no headroom — a fractional CPU or a cold start can trip the limit.",
          "A common pattern is request = the JVM's guaranteed working set and limit = modest burst headroom, so the GC and native layers are not squeezed into OOMKilled. For CPU, GC and compiler threads scale with detected cores: a CPU limit above the request can let the JVM overshoot available CPU and cause throttling pause spikes.",
          "Prefer -XX:ActiveProcessorCount (or the JDK 15+ container detection) over guessing; it keeps GC threading stable regardless of the cgroup CPU quota."
        ]
      },
      {
        "title": "4. Pick the garbage collector by workload type",
        "body": [
          "In Kubernetes, one collector does not fit all. For the typical latency-sensitive microservice pod (p99 response time, low tail latency), ZGC or Shenandoah keep pauses under ~1ms and suit today's heap sizes. G1 is the safe, well-understood default and the best all-rounder for mid-sized heaps. If your pod is a batch job or throughput-oriented worker, Parallel GC often wins on raw throughput with larger pauses.",
          "Constrained-heap pods (under ~512Mi) can suffer from G1's region overhead and ZGC's multi-branch barriers; a small pod with a tight memory limit is often better served by G1 tuned small, or even SerialGC for very small heaps. In every case, verify the collector against the real workload with JFR, not by convention."
        ],
        "code": "# Latency-sensitive microservice (default on modern JDKs is G1)\n-XX:+UseZGC                                  # or -XX:+UseShenandoahGC\n\n# Throughput-oriented batch / worker pod\n-XX:+UseParallelGC\n\n# Very small constrained-heap pod (< 512Mi)\n-XX:+UseG1GC -XX:MaxGCPauseMillis=100         # or -XX:+UseSerialGC below ~128Mi"
      },
      {
        "title": "5. Get diagnostics out of ephemeral pods",
        "body": [
          "Pods disappear. Capturing JFR recordings, heap or thread dumps from a running pod without a redeploy is essential — and jcmd works inside any pod that ships a JDK image (a JRE-only image surrenders these reflexes). Use kubectl exec + jcmd to start/stop a recording on demand, then copy it out.",
          "For always-on observability, run the Prometheus JMX Exporter as a Java agent (or sidecar) so JVM metrics — heap, GC pauses, threads, classes — are scraped by your Prometheus/k8s monitoring. Because a JVM pod can be rescheduled mid-analysis, prefer streaming or pushing monitoring data out rather than relying on a local file that dies with the pod."
        ],
        "code": "# Start a 2-minute JFR recording in a running pod\nkubectl exec deploy/myapp -- sh -c \\\n  'jcmd $(pgrep -f MainClass) JFR.start duration=120s filename=/tmp/app.jfr settings=profile'\n\n# Copy it out before the pod is deleted\nkubectl cp myapp-pod:/tmp/app.jfr ./app.jfr   # examine with JDK Mission Control\n\n# Or stream JVM metrics via the JMX Exporter agent\n-XX:+UnlockDiagnosticVMOptions -XX:+ExportDynamicAttach \\\n   -javaagent:/opt/jmx_prometheus_javaagent.jar=8080:/opt/config.yaml"
      },
      {
        "title": "6. Graceful shutdown & HPA so you only pay for what you need",
        "body": [
          "Java shutdown is slow: JIT threads, GC and the JVM shutdown hooks need time. Configure lifecycle preStop hooks and terminationGracePeriodSeconds so a rolling deploy or scale-down doesn't kill a JVM mid-scenario — and so JFR/thread dumps aren't lost on the way out.",
          "Pair the JVM tuning with HorizontalPodAutoscaler (HPA) on a relevant metric (often request latency or custom requests/sec via Prometheus, not raw CPU, which Java services spike). Correct requests keep the scheduler from stacking too many pods on a node where the JVM's native overhead plus heap can no longer both fit."
        ],
        "code": "lifecycle:\n  preStop:\n    exec:\n      command: [\"sh\", \"-c\", \"jcmd $(pgrep -f MainClass) JFR.stop name=default || true; sleep 5\"]\nterminationGracePeriodSeconds: 60\n\n---\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: myapp\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: myapp\n  minReplicas: 2\n  maxReplicas: 12\n  metrics:\n  - type: Resource\n    resource:\n      name: cpu\n      target:\n        type: Utilization\n        averageUtilization: 70"
      }
    ],
    "quickstart": [
      {
        "title": "A safe starting point for most JVM service pods",
        "body": [
          "Start from container-aware JDK defaults, size the heap as a percentage of the pod limit, and confirm with the JVM's own reported settings. Tune GC only after you have JFR data showing a specific problem."
        ],
        "code": "# manifest snippet: a generally safe JVM habit\nargs: [\"-XX:MaxRAMPercentage=75\", \"-jar\", \"/app/app.jar\"]\nresources:\n  limits:    { memory: \"1Gi\", cpu: \"1000m\" }\n  requests:  { memory: \"512Mi\", cpu: \"250m\" }\n\n# sanity check from inside the pod\nkubectl exec deploy/myapp -- java -XshowSettings:vm -version | grep 'max heap'\n# => should be ~768.00M for a 1Gi limit at MaxRAMPercentage=75"
      }
    ],
    "faq": [
      { "q": "Why is my pod OOMKilled even though the heap looks small?", "a": "The JVM's native footprint — metaspace, thread stacks, JIT code cache, GC structures, and any off-heap direct memory — sits outside -Xmx. With a tight pod limit the cgroup killer can trigger before the heap is full. Reduce MaxRAMPercentage, add native headroom to the limit, and check RSS vs heap with kubectl top / docker stats. Netty/Lucene-style off-heap allocations are a common culprit." },
      { "q": "-Xmx in MB or MaxRAMPercentage — which should I use?", "a": "Prefer -XX:MaxRAMPercentage so the heap scales with the pod's memory limit and survives manifest changes. Fall back to a hard -Xmx only when a framework or a non-% constraint requires an exact heap; even then set it via an env var coupled to the resource limit." },
      { "q": "My pod is being CPU-throttled — do I need more CPU?", "a": "Often the JVM is spawning GC/compiler threads for the host's core count while the cgroup caps CPU. Set -XX:ActiveProcessorCount to the container's expected CPU, or raise the CPU limit. Watch GC pause spikes tied to cgroup capping before buying more CPU." },
      { "q": "Is ZGC the right choice for every k8s service pod?", "a": "No. ZGC trades some CPU and memory for sub-millisecond pauses, which matters for latency-critical microservices with sizable heaps. For small constrained heaps or throughput-bound batch pods, G1 or Parallel are simpler and cheaper. Validate with JFR, not convention." }
    ],
    "updated": "August 2026"
  }
];

export const GUIDES: Guide[] = [
  {
    "slug": "jvm-flags",
    "category": "jvm-cli",
    "title": "JVM Flags: The Practical Tuning Guide",
    "metaTitle": "JVM flags: the practical guide with examples (-Xmx, -XX, -Xlog)",
    "metaDescription": "Understand and tune JVM flags: heap sizing (-Xmx/-Xms), default -XX settings, GC and JFR flags, how to inspect and mutate flags with jinfo and jcmd.",
    "intro": [
      "Every JVM behavior you can influence — heap size, collector choice, GC logging, JFR — is a command-line flag or a runtime-mutable flag. The painful part is that most tuning advice is folklore, so this guide focuses on the flags you will actually set, how to see what's in effect, and how to change them on a running process.",
      "Modern Java (9+) also has Unified Logging (-Xlog) and, since JDK 11, flags you can flip live with jinfo and jcmd -XX external commands — but never confuse 'set a flag live' with 'tune correctly.' Measure before and after."
    ],
    "sections": [
      {
        "title": "The flags you'll actually set",
        "body": [
          "These cover 95% of production tuning. Get these right before touching exotic -XX flags."
        ],
        "code": "java -Xms2g -Xmx2g \\          # initial & max heap\n     -XX:+UseG1GC \\            # collector (G1 default in LTS 11/17/21)\n     -XX:MaxMetaspaceSize=512m \\ # bound metaspace\n     -Xlog:gc*:file=gc.log:time,level,tags \\ # GC log (JDK 9+)\n     -jar app.jar",
        "table": {
          "cols": [
            "Flag",
            "What it does",
            "Common value"
          ],
          "rows": [
            [
              "-Xms / -Xmx",
              "Initial / max heap (set equal to avoid resize)",
              "equal, e.g. -Xms2g -Xmx2g"
            ],
            [
              "-XX:MaxMetaspaceSize",
              "Cap the (formerly permanent-gen) metaspace",
              "256m-512m"
            ],
            [
              "-XX:+UseShenandoahGC / UseZGC",
              "Low-pause collectors (JDK-specific availability)",
              "per workload"
            ],
            [
              "-XX:MaxGCPauseMillis",
              "G1 adaptive pause target (soft goal)",
              "200"
            ],
            [
              "-XX:+PrintGCDetails / -Xlog:gc",
              "GC logging",
              "on for diagnosis"
            ]
          ]
        }
      },
      {
        "title": "See what a JVM actually started with",
        "body": [
          "Write good flags in the run script and verify with the runtime — not memory."
        ],
        "code": "# Effective flags of a live JVM\njcmd <pid> VM.flags\njinfo -flags <pid>\n\n# Just the GC collector / max heap\njcmd <pid> VM.flags | grep -iE 'UseG1|MaxHeap|Metaspace'"
      },
      {
        "title": "Change flags on a running JVM",
        "body": [
          "Some flags are manageable at runtime via jinfo -flag and jcmd; others require a restart. Always confirm the flag is manageable before relying on a live tweak."
        ],
        "code": "# Toggle a boolean or set a string flag live\njinfo -flag +PrintGC <pid>\njcmd <pid> VM.set_flag MaxGCPauseMillis 150"
      },
      {
        "title": "Tuning workflow (not folklore)",
        "body": [
          "Baseline first, then change one variable. GC logging + a profiler give you before/after numbers."
        ],
        "code": "# 1) baseline with GC log\njava -Xlog:gc*:file=gc-baseline.log:time,level,tags -jar app.jar\n# 2) profile hot methods\n# 3) change ONE flag, repeat, compare"
      },
      {
        "title": "Flags to be careful with",
        "body": [
          "Avoid cargo-cult -XX flags like -XX:+UseConcMarkSweepGC (removed in JDK 14). Prefer the defaults unless you have a measured reason. -XX:+TieredCompilation, -XX:+UseZGC etc. all have trade-offs."
        ]
      }
    ],
    "faq": [
      {
        "q": "Should -Xms equal -Xmx?",
        "a": "Setting them equal avoids heap-grow/shrink resizes and pauses, and is standard for stable services. If you want headroom for spikes, a separate max can help but costs resize work."
      },
      {
        "q": "Where do I put flags that changes are permanent?",
        "a": "In the JVM launch command (run script, container spec, or service manager's Java opts) — not only live via jinfo — so the config survives restarts and is reviewable."
      },
      {
        "q": "Does GC flag tuning still matter with ZGC/Shenandoah?",
        "a": "Less so — low-pause collectors remove most 'tune G1 to reduce full GCs' drama. Tuning shifts to heap sizing, region sizing, and metaspace caps."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "heap-dump-analysis",
    "title": "Heap Dump Analysis: From OutOfMemoryError to Root Cause",
    "metaTitle": "Heap dump analysis guide: capture, open and find memory leaks",
    "metaDescription": "Step-by-step heap dump analysis: capture with jmap/jcmd, enable -XX:+HeapDumpOnOutOfMemoryError, open in Eclipse MAT, and use OQL to find leaks.",
    "intro": [
      "A heap dump is a snapshot of every object in the JVM's heap at a moment in time. When memory grows or the process dies with OutOfMemoryError, the dump is the definitive evidence: which objects exist, how big they are, and what keeps them alive.",
      "This guide walks the full path — enabling automatic dumps, capturing manually, opening in Eclipse MAT, and turning a 'could be a leak' into a named class, an allocation site, and a fix."
    ],
    "sections": [
      {
        "title": "Enable automatic dump on OOM",
        "body": [
          "Best insurance: tell the JVM to dump the heap the moment it dies from OOM, so you always have a forensic artifact."
        ],
        "code": "java -Xmx2g \\\n  -XX:+HeapDumpOnOutOfMemoryError \\\n  -XX:HeapDumpPath=/var/log/app.hprof \\\n  -jar app.jar"
      },
      {
        "title": "Capture manually with jmap/jcmd",
        "body": [
          "Useful for investigating high heap before it OOMs. Find the PID, then dump live (reachable) objects."
        ],
        "code": "jps -l\njcmd <pid> GC.heap_dump /tmp/heap.live.hprof\n# or\njmap -dump:live,file=/tmp/heap.live.hprof <pid>"
      },
      {
        "title": "Open and read with Eclipse MAT",
        "body": [
          "Launch MAT and File > Open Heap Dump. Start with the Overview > Leak Suspects, then drill into the Dominator Tree and Path to GC Roots."
        ],
        "code": "# Launch MAT\nMemoryAnalyzer /tmp/heap.live.hprof"
      },
      {
        "title": "Find the leak with a 2-dump diff",
        "body": [
          "The classic trick: dump at T1 and T2 over a growing window. If a class's retained size roughly doubles with your growth rate, you've located the accumulation."
        ],
        "code": "jcmd <pid> GC.heap_dump /tmp/h1.hprof\n# ... run the workload ...\njcmd <pid> GC.heap_dump /tmp/h2.hprof\n# In MAT: compare the Histograms or use the 'Compare' delta tool"
      },
      {
        "title": "Write an OQL query",
        "body": [
          "OQL filters instances when the reports are too broad — e.g., list all your cache entries over a size threshold."
        ],
        "code": "SELECT * FROM com.example.CacheEntry o WHERE o.@retainedHeapSize > 1048576"
      }
    ],
    "faq": [
      {
        "q": "Live vs full dump — which do I capture?",
        "a": "Live (reachable) is smaller and shows what the app is actually holding. Full includes finalizable/garbage candidates and is used to inspect unreachable-but-uncollected objects. Start with live."
      },
      {
        "q": "Heap dump causes a pause — is that OK?",
        "a": "Capturing opens the object graph, which adds memory pressure and can cause GC pauses. On production, prefer -XX:+HeapDumpOnOutOfMemoryError (only fires at death) or schedule a manual capture."
      },
      {
        "q": "What if the dump is huge and MAT runs out of heap?",
        "a": "Raise MAT's own -Xmx in MemoryAnalyzer.ini (e.g., -Xmx8g), and capture live dumps to keep the file manageable."
      }
    ],
    "updated": "August 2026"
  },
  {
    "slug": "thread-dump-analysis",
    "title": "Thread Dump Analysis: Diagnose Hangs and Deadlocks",
    "metaTitle": "Thread dump analysis guide: capture, read and find deadlocks",
    "metaDescription": "Read Java thread dumps to find hangs, deadlocks and blocked threads: capture with jstack/jcmd, identify thread states, and spot the culprit stack.",
    "intro": [
      "A thread dump shows every thread in the JVM at an instant: its state (RUNNABLE, WAITING, BLOCKED, TIMED_WAITING), its lock if it's waiting, and its full stack. It is the primary evidence for hangs, deadlocks, and 'why is nothing happening' questions.",
      "The skill is pattern recognition: a handful of thread dumps taken a few seconds apart, plus knowledge of the states, turns a cryptic stack into a named culprit almost every time."
    ],
    "sections": [
      {
        "title": "Capture two or three dumps",
        "body": [
          "One dump can catch transients; two-to-three a few seconds apart confirm a genuine hang."
        ],
        "code": "for i in 1 2 3; do\n  # modern: jcmd Thread.print -l ; classic: jstack -l\n  jcmd <pid> Thread.print -l > threads-$i.txt\n  sleep 5\ndone\n# diff normalized lines to see what didn't move\ndiff <(cut -c1-140 threads-1.txt) <(cut -c1-140 threads-2.txt)"
      },
      {
        "title": "Read the thread states",
        "body": [
          "Each thread line starts with its name and state. RUNNABLE at high CPU = working (or spinning); WAITING/TIMED_WAITING = parked on a monitor or lock; BLOCKED = contending for a monitor owned by another thread."
        ],
        "table": {
          "cols": [
            "State",
            "Meaning",
            "Action"
          ],
          "rows": [
            [
              "RUNNABLE",
              "Executing (or ready)",
              "Hot CPU threads = profile, don't just dump"
            ],
            [
              "WAITING",
              "parked on a monitor/lock",
              "Check who owns the lock"
            ],
            [
              "BLOCKED",
              "waiting on a monitor held by another",
              "Find the owner thread"
            ],
            [
              "TIMED_WAITING",
              "parked with a timeout",
              "Usually fine; pool idle threads"
            ]
          ]
        }
      },
      {
        "title": "Find the deadlock",
        "body": [
          "jstack prints 'Found one Java-level deadlock' with the implicated threads and the lock cycle automatically. If it's not detected, look for two threads each holding a lock the other wants."
        ],
        "code": "jstack <pid> | grep -A 15 -i deadlock"
      },
      {
        "title": "Spot the common hang culprits",
        "body": [
          "Blocked on an InputStream/socket read, on a connection pool lock, or inside an RMI/Object wait — these match symptom to subsystem. Pair the stuck frame with the owning thread's stack to see the full picture."
        ]
      },
      {
        "title": "Tooling to make dumps readable",
        "body": [
          "For hundreds of threads, the thread-dump view in JDK Mission Control or VisualVM, or a dedicated analyzer like TDA, collapses threads by state and flag repeats."
        ],
        "code": "# Open the raw dump in JMC (File > Open) or\n# paste into a thread-dump analyzer for grouped view"
      }
    ],
    "faq": [
      {
        "q": "When is a thread dump the right tool versus a profiler?",
        "a": "Dumps answer 'where is everyone stuck' right now. Profilers answer 'where does CPU/allocation go over time'. Hangs and deadlocks = dumps; steady-state slowness = profiler."
      },
      {
        "q": "What does the default gorup '/0-0' mean in the dump?",
        "a": "Thread groups are largely obsolete metadata; the group is rarely a diagnostic signal in modern JVMs. Focus on thread names, states, and stacks."
      },
      {
        "q": "My dump has hundreds of threads — where do I start?",
        "a": "Filter by state. A hang is usually a handful of BLOCKED threads converging on one lock, or a few RUNNABLE threads spinning. The vast majority of pool threads are TIMED_WAITING and idle."
      }
    ],
    "updated": "August 2026"
  }
];

export function toolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
