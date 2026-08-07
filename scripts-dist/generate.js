// scripts/generate.ts
import {writeFileSync, mkdirSync, rmSync} from "node:fs";
import {join} from "node:path";

// scripts/data.ts
var SITE_NAME = "JVM Tools";
var SITE_URL = "https://jvm.tools";
var GITHUB_REPO = "https://github.com/ndimas/jvm.tools";
var CATEGORIES = [
  {
    slug: "jvm-cli",
    navLabel: "JVM CLI",
    title: "JVM Command-Line Tools",
    metaTitle: "JVM Command-Line Tools (jcmd, jstat, jmap, jstack) \u2014 The Complete Guide",
    metaDescription: "The definitive guide to the JVM tools shipped with the JDK: jcmd, jstat, jmap, jstack, jps, jinfo, jfr and more, with real command examples for diagnosis and tuning.",
    intro: [
      "Every JDK ships with a set of diagnostic and management command-line tools that live inside the bin/ directory. Because they travel with the runtime, they are the first tools you should reach for when a Java process misbehaves: they cost nothing, require no agent or instrumentation, and work almost everywhere.",
      "These tools talk to a running JVM through the Java Attach API (the same mechanism the jcmd, jps and jinfo tools use), or operate directly on saved artifacts such as heap dumps and thread dumps. Mastering a handful of them covers most day-to-day diagnosis: finding a process (jps), dumping threads (jstack), sampling the heap (jmap), inspecting flags (jinfo) and triggering diagnostics (jcmd).",
      "Below is every bundled tool worth knowing, with the commands that actually matter."
    ],
    bullets: [
      "See what's running: jps, jcmd -l",
      "Trigger diagnostics & dump threads/heaps: jcmd, jfr",
      "Inspect live statistics: jstat, jinfo",
      "Capture thread and heap artifacts for offline analysis"
    ]
  },
  {
    slug: "profiling",
    navLabel: "Profiling",
    title: "JVM Profilers & Performance Analysis Tools",
    metaTitle: "Best JVM Profilers (async-profiler, VisualVM, JFR, JMC) Compared",
    metaDescription: "Compare the best JVM profilers and performance tools: async-profiler, Java Flight Recorder, JDK Mission Control, YourKit, VisualVM and more, with guidance on when to use each.",
    intro: [
      "When a Java service is slow, a profiler tells you where the CPU time and allocations actually go instead of wherever a hunch points. Modern JVM profiling has largely converged on two complementary techniques: sampled async profiling (async-profiler) and events recorded by the JVM itself (Java Flight Recorder).",
      "This hub compares the practical options \u2014 from the free, bundled and open-source tools to the commercial IDEs \u2014 and links to real quick-starts for the ones that matter most."
    ],
    bullets: [
      "Start here with async-profiler for CPU & allocation flame graphs",
      "Use Java Flight Recorder (JFR) for zero-overhead, always-on recording",
      "Open JFR recordings and thread dumps in JDK Mission Control",
      "Compare VisualVM, YourKit and IDE-integrated profilers"
    ]
  },
  {
    slug: "memory",
    navLabel: "Memory",
    title: "JVM Memory & Garbage Collection Tools",
    metaTitle: "JVM Memory, Heap Dump & GC Analysis Tools (MAT, jmap, GCViewer)",
    metaDescription: "Tools to analyze Java heap dumps, object allocation and garbage collection logs: Eclipse MAT, jmap, GCViewer, gceasy and more, with real usage examples.",
    intro: [
      "OutOfMemoryError reports, growing heap graphs in your monitoring, and slowly-rotting response times are usually signs one of two things: a leak, or excessive garbage-collection pressure. The tools in this category are how you turn those symptoms into an exact cause.",
      "Two distinct workflows matter here. Heap-dump analysis answers 'what is holding onto this memory' (Eclipse MAT, jmap -dump). GC log / GC behavior analysis answers 'why is the collector working so hard' (GCViewer, gceasy, -Xlog:gc). Most teams need both."
    ],
    bullets: [
      "Capture a heap dump: jmap -dump:live, /diagnostic/jmap/status",
      "Find leaks & dominators with Eclipse MAT",
      "Analyze GC logs with GCViewer or gceasy",
      "Understand modern collectors: G1, ZGC, Shenandoah, Parallel"
    ]
  },
  {
    slug: "bytecode",
    navLabel: "Bytecode",
    title: "Java Bytecode Manipulation & JVM Languages",
    metaTitle: "Java Bytecode Manipulation Tools (ASM, Byte Buddy) & JVM Languages",
    metaDescription: "A practical guide to manipulating Java bytecode with ASM and Byte Buddy, and the JVM languages (Kotlin, Groovy, Scala) that compile to the class-file format.",
    intro: [
      "The Java bytecode format (class files) is a stable, documented target. Because the JVM executes bytecode rather than source, any JVM language can compile to it, and runtime libraries can generate or transform classes after compilation. This is what powers proxies, ORMs, mocking frameworks and most modern frameworks' cleverness.",
      "If you need to read or transform class files directly, ASM is the low-level Swiss-army knife with the smallest dependency footprint. If you want to generate classes at runtime with a friendlier API, Byte Buddy raises the level far above raw ASM. For whole programs on the JVM, the alternative-language ecosystem (Kotlin, Groovy, Scala, Clojure) is the practical way to express more with less."
    ],
    bullets: [
      "Low-level class-file reading & rewriting with ASM",
      "Runtime code generation & proxies with Byte Buddy",
      "Understand the class-file & verification model",
      "The JVM language ecosystem compiled to bytecode"
    ]
  },
  {
    slug: "build",
    navLabel: "Build",
    title: "JVM Build & Dependency Management Tools",
    metaTitle: "JVM Build Tools: Maven vs Gradle, JDK tooling (jlink, JBang)",
    metaDescription: "Compare JVM build and packaging tools \u2014 Apache Maven, Gradle, sbt, Bazel and JBang \u2014 plus the JDK packaging tools jlink, jpackage and sdks.",
    intro: [
      "A modern JVM project is built by one of a small set of tools: Maven and Gradle dominate, with sbt and Bazel in specific niches. All of them orchestrate compilation, testing, packaging and dependency resolution against repositories such as Maven Central.",
      "Beyond the build orchestrators, the JDK itself ships packaging and modularization tools \u2014 jlink for custom runtimes, jpackage for native installers, jmod for module files \u2014 that have grown far more important since the modularization of Java 9. The growth of single-file Java (java Source.java, JBang) has also changed what 'a build tool' has to be for small projects and prototypes."
    ],
    bullets: [
      "Maven vs Gradle: how to choose for a project",
      "jlink & jpackage for small, distributable runtimes",
      "JBang and source-file mode for scripts and prototypes",
      "Dependency repositories and consistency: Maven Central, lockfiles"
    ]
  },
  {
    slug: "testing",
    navLabel: "Testing",
    title: "JVM Testing & Microbenchmark Tools",
    metaTitle: "JVM Testing Tools: JUnit 5, Testcontainers, Mockito, JMH",
    metaDescription: "The practical toolkit for testing and benchmarking JVM software: JUnit 5, Testcontainers, Mockito, AssertJ, Arquillian, Gatling, and JMH for microbenchmarks.",
    intro: [
      "Test-driven code on the JVM rests on a durable core of tooling: a test framework (JUnit 5 or TestNG), an assertion library (AssertJ), and a mocking library (Mockito). Around that core, Testcontainers lets you spin up real infrastructure for integration tests, and JMH is the only sane way to microbenchmark code on a modern JIT-compiled JVM.",
      "For performance and load, Gatling and k6 cover scenario-based load testing. Because the JVM's JIT compiler makes naive benchmarking meaningless, JMH deserves special attention whenever you need a measured number."
    ],
    bullets: [
      "Unit tests: JUnit 5, TestNG, AssertJ, Mockito",
      "Integration tests with real containers: Testcontainers",
      "Microbenchmarks without JIT pitfalls: JMH",
      "Load & API testing: Gatling, k6"
    ]
  }
];
var TOOLS = [
  { slug: "jcmd", name: "jcmd", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html", desc: "Sends diagnostic commands to a running JVM: heap dumps, thread dumps, JFR start/stop, GC.run, VM.system_properties and hundreds of others.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jps", name: "jps", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jps.html", desc: "Lists running Java processes and their VM identifiers (the `jps -lv` one-liner is how you map a PID to a JVM and its command line).", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jstat", name: "jstat", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstat.html", desc: "Prints live JVM statistics \u2014 GC counts and times, class-loading and compilation rates \u2014 in a single line, perfect for quick sampling in a loop.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jmap", name: "jmap", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jmap.html", desc: "Prints a process's memory map and heap summary, and can dump the heap to a file (jmap -dump) for offline analysis in Eclipse MAT.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jstack", name: "jstack", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstack.html", desc: "Dumps the thread stacks of a running JVM to stdout or a file, the raw material for deadlock and hang analysis.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jinfo", name: "jinfo", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jinfo.html", desc: "Prints or changes system properties and JVM flags of a running process (update a flag that is mutable at runtime, or read what a process actually started with).", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jfr", name: "java -XX:StartFlightRecording / jfr", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jfr.html", desc: "Java Flight Recorder: records profiling events (CPU, allocations, GC, locks, exceptions) with low overhead; `jfr` reads and prints .jfr recordings after the fact.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jshell", name: "jshell", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jshell.html", desc: "The Java REPL introduced in JDK 9, for trying snippets and exploring APIs interactively before putting them in a file.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "javap", name: "javap", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/javap.html", desc: "The class-file disassembler: shows class signatures, constant pools, and bytecode, invaluable for understanding what the compiler actually emitted.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jlink", name: "jlink", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jlink.html", desc: "Assembles a custom, minimal JVM runtime image with only the modules your application needs; the backbone of small 'slim' Java distributions.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jdb", name: "jdb", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jdb.html", desc: "The Java Debugger, a command-line debugging client that attaches to a JVM started with debugging enabled. Functional but clunky; most reach for an IDE debugger.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jhsdb", name: "jhsdb", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jhsdb.html", desc: "The HotSpot debugger, a post-mortem and live forensics tool that can inspect a crashed or hung JVM via its SA (Serviceability Agent) internals.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "async-profiler", name: "async-profiler", url: "https://github.com/async-profiler/async-profiler", desc: "The de-facto standard sampled profiler: low-overhead CPU and allocation profiling with flame graphs, usable directly or inside IntelliJ and your JFR workflow.", category: "profiling", license: "Apache-2.0", kind: "open-source" },
  { slug: "visualvm", name: "VisualVM", url: "https://visualvm.github.io/", desc: "The bundled-style visual tool for profiling and monitoring local and remote JVMs: CPU/memory sampling, thread and heap dump viewing, and JFR/GC analysis.", category: "profiling", license: "GPLv2 + CE", kind: "open-source" },
  { slug: "jmc", name: "JDK Mission Control (JMC)", url: "https://github.com/openjdk/jmc", desc: "The rich client for analyzing JFR recordings and live JVMs: flame graphs, allocation and lock analysis, and GC pause views on top of Java Flight Recorder data.", category: "profiling", license: "UPL-1.0 (open)", kind: "open-source" },
  { slug: "yourkit", name: "YourKit Java Profiler", url: "https://www.yourkit.com/", desc: "A mature commercial profiler with deep allocation, lock, and JEE profiling plus out-of-the-box integrations; polished UI and low overhead.", category: "profiling", license: "Commercial (licenses + free eval)", kind: "commercial" },
  { slug: "jprofiler", name: "JProfiler", url: "https://www.ej-technologies.com/products/jprofiler/overview.html", desc: "A long-standing commercial Java profiler known for its strong CPU, memory, and JDBC/HTTP call-tree analysis and offline profiling of recorded sessions.", category: "profiling", license: "Commercial (licenses + free eval)", kind: "commercial" },
  { slug: "arthas", name: "Arthas", url: "https://arthas.aliyun.com/", desc: "Alibaba's widely used open-source JVM diagnostic tool: attach to a running JVM to watch method arguments/returns, find slow calls, detect CPU hotspots and hot methods without redeploying.", category: "profiling", license: "Apache-2.0", kind: "open-source" },
  { slug: "micrometer", name: "Micrometer", url: "https://micrometer.io/", desc: "The vendor-neutral metrics facade: instrument your JVM app once and route to Prometheus, Datadog, New Relic, Graphite or dozens of other backends.", category: "profiling", license: "Apache-2.0", kind: "open-source" },
  { slug: "jmx-exporter", name: "Prometheus JMX Exporter", url: "https://github.com/prometheus/jmx_exporter", desc: "Exposes JVM runtime metrics (heap, GC, threads, classes) as Prometheus metrics via a Java agent or standalone HTTP server; the standard bridge to Kubernetes monitoring.", category: "profiling", license: "Apache-2.0", kind: "open-source" },
  { slug: "eclipse-mat", name: "Eclipse MAT", url: "https://eclipse.dev/mat/", desc: "The standard heap-dump analyzer: leaks suspect report, dominator tree, OQL queries, and path-to-gc-roots to pinpoint what's holding onto memory.", category: "memory", license: "EPL-2.0", kind: "open-source" },
  { slug: "gcviewer", name: "GCViewer", url: "https://github.com/chewiebug/GCViewer", desc: "A Java tool that parses GC log files into charts of pause times, throughput and heap usage; the classic quick look at garbage collection behavior.", category: "memory", license: "LGPL-2.1", kind: "open-source" },
  { slug: "gceasy", name: "GCeasy", url: "https://gceasy.io/", desc: "Upload a GC log and get an instant, annotated analysis \u2014 pause stats, throughput, latency percentiles, and likely tuning recommendations \u2014 hosted in the browser.", category: "memory", license: "Free tier + paid", kind: "managed" },
  { slug: "jamm", name: "Java Agent for Memory Measurements (JAMM)", url: "https://github.com/jbellis/jamm", desc: "A Java agent that measures actual in-memory size of objects, including JVM per-object overhead, when you need byte-accurate 'how big is this really' answers.", category: "memory", license: "Apache-2.0", kind: "open-source" },
  { slug: "jol", name: "JOL (Java Object Layout)", url: "https://github.com/openjdk/jol", desc: "OpenJDK's tool for measuring and printing the on-heap layout and footprint of objects and arrays, useful for understanding alignment and padding costs.", category: "memory", license: "GPLv2 w/ CE", kind: "open-source" },
  { slug: "visualgc", name: "VisualGC", url: "https://visualvm.github.io/plugins.html", desc: "The classic VisualVM plugin showing live generations, spaces, and GC counts for a JVM; still the clearest quick view of how a collector is ticking.", category: "memory", license: "GPLv2 + CE", kind: "freeware" },
  { slug: "asm", name: "ASM", url: "https://asm.ow2.io/", desc: "The low-level, battle-tested bytecode library used across the whole ecosystem (every JDK since JDK 9 uses it internally) for reading and rewriting class files.", category: "bytecode", license: "BSD-3", kind: "open-source" },
  { slug: "byte-buddy", name: "Byte Buddy", url: "https://bytebuddy.net/", desc: "A high-level runtime class-generation library with a fluent API; the easiest way to create dynamic proxies, agents, and generated types without writing assembly.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "javassist", name: "Javassist", url: "https://www.javassist.org/", desc: "A bytecode toolkit that lets you edit class files using Java-source-level snippets rather than low-level opcodes; handy when ASM feels too low-level.", category: "bytecode", license: "Apache-2.0 + LGPL", kind: "open-source" },
  { slug: "cglib", name: "cglib", url: "https://github.com/cglib/cglib", desc: "The older, classic bytecode-generation library famous for powering Spring proxies; still broadly deployed, though mostly superseded by Byte Buddy.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "kotlin", name: "Kotlin", url: "https://kotlinlang.org/", desc: "The most successful JVM language besides Java; a modern, null-safe, concise language that compiles to bytecode and fully interoperates with existing Java.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "groovy", name: "Groovy", url: "https://groovy-lang.org/", desc: "A dynamic, optionally-typed JVM language with a scripting-friendly feel; compiles to bytecode and is the base of the Grails web framework.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "scala", name: "Scala", url: "https://www.scala-lang.org/", desc: "A statically-typed, functional-first JVM language; its compiler emits bytecode that interoperates with Java while enabling richer type systems.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "graalvm", name: "GraalVM (Truffle & native-image)", url: "https://www.graalvm.org/", desc: "Oracle's high-performance JDK featuring a polyglot interpreter (Truffle) and native-image, which compiles JVM applications ahead-of-time to native binaries.", category: "bytecode", license: "GPLv2 with CE", kind: "open-source" },
  { slug: "maven", name: "Apache Maven", url: "https://maven.apache.org/", desc: "The longest-standing dominant build tool: convention-driven lifecycle, XML POMs, and a massive ecosystem of plugins; the default in most enterprises.", category: "build", license: "Apache-2.0", kind: "open-source" },
  { slug: "gradle", name: "Gradle", url: "https://gradle.org/", desc: "The flexible, fast, Groovy/Kotlin-DSL build tool famous for incremental builds and the de-facto choice for Android; supports both Maven and Gradle-based dependencies.", category: "build", license: "Apache-2.0", kind: "open-source" },
  { slug: "jbang", name: "JBang", url: "https://www.jbang.dev/", desc: "Runs single-file Java and JVM-language source files directly, resolving dependencies from Maven Central automatically \u2014 the modern way to script Java.", category: "build", license: "MIT", kind: "open-source" },
  { slug: "jpackage", name: "jpackage", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jpackage.html", desc: "The JDK tool that packages a modular app into a platform-native installer (dmg, msi, deb, rpm) containing a private runtime.", category: "build", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "sbt", name: "sbt", url: "https://www.scala-sbt.org/", desc: "The interactive Scala build tool; incremental compilers and a REPL-first workflow make it the standard for Scala projects.", category: "build", license: "Apache-2.0", kind: "open-source" },
  { slug: "bazel", name: "Bazel", url: "https://bazel.build/", desc: "Google's multi-language build system with remote caching and hermetic builds; chosen when build performance at very large scale matters.", category: "build", license: "Apache-2.0", kind: "open-source" },
  { slug: "junit5", name: "JUnit 5", url: "https://junit.org/junit5/", desc: "The current standard testing framework for the JVM: annotations, dynamic tests, and the Jupiter extension model; runs on the JUnit Platform.", category: "testing", license: "EPL-2.0", kind: "open-source" },
  { slug: "testng", name: "TestNG", url: "https://testng.org/", desc: "A test framework inspired by JUnit that adds parallel execution, data providers and rich configuration; a strong alternative when those matter.", category: "testing", license: "Apache-2.0", kind: "open-source" },
  { slug: "assertj", name: "AssertJ", url: "https://assertj.github.io/doc/", desc: "A fluent, rich assertion library for writing readable tests with descriptive failure messages; the standard companion to JUnit 5.", category: "testing", license: "Apache-2.0", kind: "open-source" },
  { slug: "mockito", name: "Mockito", url: "https://github.com/mockito/mockito", desc: "The most widely used mocking framework on the JVM; creates fake objects, stubs methods and verifies interactions in tests.", category: "testing", license: "MIT", kind: "open-source" },
  { slug: "testcontainers", name: "Testcontainers", url: "https://testcontainers.com/", desc: "Spins up real Docker infrastructure (databases, message brokers, browsers) for integration tests, then tears it down; makes repeatable integration testing practical.", category: "testing", license: "Apache-2.0", kind: "open-source" },
  { slug: "jmh", name: "JMH (Java Microbenchmark Harness)", url: "https://github.com/openjdk/jmh", desc: "OpenJDK's harness for writing correct microbenchmarks \u2014 it deals with warm-up, dead-code elimination and JIT effects so your numbers mean something.", category: "testing", license: "GPLv2 w/ CE", kind: "open-source" },
  { slug: "gatling", name: "Gatling", url: "https://gatling.io/", desc: "A high-performance, scenario-based load-testing tool that records realistic user flows and reports rich KPIs; easy to script in Scala or Java.", category: "testing", license: "Apache-2.0 (core)", kind: "open-source" },
  { slug: "k6", name: "Grafana k6", url: "https://k6.io/", desc: "A developer-friendly load-testing tool scripted in JavaScript that executes with a Go engine; widely used for API and k8s load testing.", category: "testing", license: "AGPL-3.0 (OSS core)", kind: "open-source" }
];

// scripts/content.ts
function toolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug);
}
var DEEP_DIVES = [
  {
    slug: "jcmd",
    category: "jvm-cli",
    toolSlug: "jcmd",
    h1: "jcmd: Send Diagnostic Commands to a Running JVM",
    metaTitle: "jcmd examples: dump heap, threads and JFR on a live JVM",
    metaDescription: "jcmd examples and reference: list commands, capture heap and thread dumps, start and stop Java Flight Recorder, force GC and inspect flags.",
    intro: [
      "jcmd is the most powerful bundled JVM diagnostic tool and the one most developers under-use. Rather than juggling several binaries, jcmd sends a list of diagnostic commands to a running JVM over the Java Attach API: heap dumps, thread dumps, starting/stopping Java Flight Recorder recordings, forcing garbage collection, and reading or flipping flags.",
      "Because it speaks to any attachable local JVM, jcmd has become the natural first stop for 'what is this process doing' questions. Keep jps in your pocket to find PIDs, and jcmd for everything after that."
    ],
    useWhen: [
      "You need to see every diagnostic command a JVM supports without memorizing separate tools.",
      "You want a heap dump, thread dump, or JFR recording captured on demand from a live process.",
      "You need to force a GC, or read/change a mutable JVM flag.",
      "You are automating diagnostics across many JVMs and want one consistent interface."
    ],
    avoidWhen: [
      "The JVM is remote with no attach mechanism exposed; prefer JMX, JFR over a websocket, or jstatd networking.",
      "The process started with -XX:+DisableAttachMechanism; attach tools (jcmd, jmap, jstack) will refuse to connect, so use an agent or restart with attach enabled."
    ],
    basics: [
      {
        title: "Find processes and list commands",
        body: [
          "jps maps Java processes to PIDs; ask the target JVM for its supported commands with jcmd <pid> help."
        ],
        code: "# Find Java PIDs\njps -lvv\n\n# What can this JVM do?\njcmd <pid> help\n\n# List attachable JVMs\njcmd -l"
      },
      {
        title: "Dump the heap",
        body: [
          "Heap dumps feed Eclipse MAT for leak/dominator analysis. The default includes only live (reachable) objects, which is smaller and usually what you want."
        ],
        code: "# Live-object heap dump\njcmd <pid> GC.heap_dump /tmp/heap.hprof\n\n# Include unreachable objects too\njcmd <pid> GC.heap_dump -all /tmp/heap-full.hprof"
      },
      {
        title: "Dump threads",
        body: [
          "Thread dumps are the raw material for deadlock and hang analysis. Take two dumps a few seconds apart and confirm the same threads are stuck before concluding it is a hang, not a transient wait."
        ],
        code: "# Thread dump to a file\njcmd <pid> Thread.print -l > threads-$(date +%s).txt"
      },
      {
        title: "Start / stop a JFR recording",
        body: [
          "Java Flight Recorder can be started on demand via jcmd even if the JVM was not launched with JFR flags. Let it run for a window, then dump the .jfr file for analysis in JDK Mission Control."
        ],
        code: "# Record for 60s into a file\njcmd <pid> JFR.start name=diag duration=60s filename=/tmp/diag.jfr\n\n# Status\njcmd <pid> JFR.check\n\n# Dump current recording (keeps recording)\njcmd <pid> JFR.dump name=diag filename=/tmp/diag.jfr\n\n# Stop\njcmd <pid> JFR.stop name=diag filename=/tmp/diag.jfr"
      },
      {
        title: "Force GC and inspect flags",
        body: [
          "For testing collector behavior or verifying which flags a process actually runs with, jcmd can explicitly trigger GC and print effective VM flags and properties."
        ],
        code: "# Request a full GC (diagnostic/benchmark aid only)\njcmd <pid> GC.run\n\n# Effective command-line flags\njcmd <pid> VM.flags\n\n# System properties\njcmd <pid> VM.system_properties"
      }
    ],
    quickstart: [
      {
        title: "90-second diagnosis loop",
        body: [
          "One pass over a live JVM: find it, capture threads, dump heap, start a short JFR recording."
        ],
        code: "jps -l\njcmd <pid> Thread.print -l > threads.txt\njcmd <pid> GC.heap_dump heap.hprof\njcmd <pid> JFR.start duration=30s filename=diag.jfr"
      }
    ],
    faq: [
      {
        q: "jcmd says it cannot attach to the process. Why?",
        a: "Attach requires the JVM to have the attach mechanism enabled and the process to be owned by a user who can attach. If it started with -XX:+DisableAttachMechanism, or runs in a hardened/containerized environment without /tmp access, attach tools fail. Run from the same user and check the runtime setup."
      },
      {
        q: "jcmd vs jmap vs jstack \u2014 which should I use?",
        a: "jcmd is the superset and the best default for heap dumps (GC.heap_dump), thread dumps (Thread.print) and JFR. jmap and jstack are the older dedicated tools and remain fine; reach for them only when you need a legacy flag jcmd lacks."
      },
      {
        q: "Is jcmd production-safe?",
        a: "Thread.print and JFR are read-only and low-overhead. GC.heap_dump and GC.run exert real pressure, so schedule those for quiet windows."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "jfr",
    category: "jvm-cli",
    toolSlug: "jfr",
    h1: "Java Flight Recorder (JFR): Always-On JVM Profiling",
    metaTitle: "Java Flight Recorder: a complete guide with jcmd and the jfr CLI",
    metaDescription: "Java Flight Recorder guide: start recordings with -XX:StartFlightRecording, manage them with jcmd JFR.*, and read .jfr files with the jfr command and JDK Mission Control.",
    intro: [
      "Java Flight Recorder (JFR) is the JVM's built-in, extremely low-overhead event recorder. It captures profiling events \u2014 CPU sampling, allocations, garbage collection, locks, exceptions, JIT compilation \u2014 continuously, with overhead typically measured in the low single-digit percentage. That makes it eligible to run in production permanently, which is why it is the backbone of modern Java observability.",
      "JFR data is stored in a ring buffer inside the JVM and can be started at launch with -XX:StartFlightRecording, or on demand with jcmd JFR.start. Recordings (.jfr files) are analyzed in JDK Mission Control, or parsed with the standalone jfr command."
    ],
    useWhen: [
      "You want always-on profiling without paying a big overhead penalty.",
      "You need to reconstruct 'what was the JVM doing' after an incident \u2014 JFR's ring-buffer history is the closest thing to a JVM black box.",
      "You need CPU, allocation, GC, lock and exception data from one consistent source."
    ],
    avoidWhen: [
      "You need stack-level sampling at extremely high frequency beyond JFR defaults \u2014 async-profiler samples more aggressively.",
      "You need source-level method timing with line numbers \u2014 fine here but richer in a dedicated profiler."
    ],
    basics: [
      {
        title: "Start JFR at launch",
        body: [
          "Start a rolling recording when the JVM boots. Settings from the default.jfc are a good baseline; use profile.jfc for more detail at higher overhead."
        ],
        code: "java -XX:StartFlightRecording=filename=/logs/app.jfr,dumponexit=true,disk=true,settings=profile -jar app.jar"
      },
      {
        title: "Start / dump / stop with jcmd",
        body: [
          "Manage the recording from outside the process. You can start a bounded recording, then dump its contents without stopping it."
        ],
        code: "jcmd <pid> JFR.start name=prod duration=5m filename=/tmp/prod.jfr\njcmd <pid> JFR.check\njcmd <pid> JFR.dump name=prod filename=/tmp/prod.jfr\njcmd <pid> JFR.stop name=prod"
      },
      {
        title: "Read a recording with the jfr command",
        body: [
          "The standalone jfr tool prints summary or per-event information without opening a GUI."
        ],
        code: "# Summary / metadata\njfr summary /tmp/prod.jfr\n\n# Print recorded events (counts, breakdowns)\njfr print --events jdk.GCPhasePause /tmp/prod.jfr"
      },
      {
        title: "Analyze in JDK Mission Control",
        body: [
          "JMC is the primary analysis UI for JFR: open the .jfr file, browse flame graphs, allocation and lock analysis, and GC pause views."
        ],
        code: "jmc"
      }
    ],
    quickstart: [
      {
        title: "Record on demand and inspect",
        body: [
          "One pass: start a short bounded recording, wait, then read back its summary."
        ],
        code: "jcmd <pid> JFR.start duration=30s filename=diag.jfr\n# ...let it run 30 seconds...\njfr summary diag.jfr"
      }
    ],
    faq: [
      {
        q: "Does JFR affect production performance?",
        a: "With the default event settings, overhead is typically under 1-2%. The profile setting is more expensive; pick it carefully. The disk-based ring buffer lets you dump history after an incident."
      },
      {
        q: "JFR vs async-profiler \u2014 do I need both?",
        a: "They complement each other. JFR gives broad, always-on events and incident-replay (especially GC, locks, exceptions). async-profiler gives deeper, lower-level CPU and native-stack sampling on demand. Many teams run JFR continuously and async-profiler during focused investigations."
      },
      {
        q: "Which JDK versions include JFR?",
        a: "JFR became open and freely usable in OpenJDK 11 and is included in all current Oracle JDK and OpenJDK distributions. If you must target an older JDK 8 build, JFR features vary by vendor."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "jmap",
    category: "jvm-cli",
    toolSlug: "jmap",
    h1: "jmap: Inspect the JVM Heap and Dump It for Analysis",
    metaTitle: "jmap examples: heap summary, memory map, and heap dump to file",
    metaDescription: "jmap examples: print heap summaries and memory maps, capture a heap dump for Eclipse MAT, and understand jmap -histo output on a live JVM.",
    intro: [
      "jmap (Java Memory Map) is the bundled tool for inspecting a running JVM's heap: it prints heap summaries, histograms of object counts by class, the process memory map, and \u2014 most importantly \u2014 can capture a full heap dump to a file for offline analysis.",
      "Since JDK 9, the recommended way to dump a heap is jcmd GC.heap_dump, but jmap remains widely deployed and its -histo output is a fast way to see 'which classes dominate this heap' without opening a GUI."
    ],
    useWhen: [
      "You want a quick histogram of what is in the heap (top object counts / sizes by class).",
      "You need a heap dump file for Eclipse MAT, JProfiler, or YourKit.",
      "You need the process memory map or class-loader data from a live JVM."
    ],
    avoidWhen: [
      "You prefer jcmd's unified interface \u2014 jcmd GC.heap_dump is the modern replacement for jmap -dump.",
      "The JVM has attach disabled (same limitation as jcmd)."
    ],
    basics: [
      {
        title: "Histogram of objects in the heap",
        body: [
          "-histo counts instances and total size per class. The output is sorted by instance count or total size depending on the flag; -histo:live restricts to reachable objects."
        ],
        code: "# Count and size of each class on the heap\njmap -histo:live <pid>\n\n# Limit to the top 30 by total size\njmap -histo:live <pid> | sort -k3 -n -r | head -30"
      },
      {
        title: "Heap summary",
        body: [
          "-heap prints a compact summary of the heap configuration and usage, plus a per-generation breakdown. Great first signal for 'is this thing out of heap'."
        ],
        code: "jmap -heap <pid>"
      },
      {
        title: "Capture a heap dump",
        body: [
          "-dump writes a .hprof file you can open in Eclipse MAT. -dump:live only serializes reachable objects, making the dump smaller and usually the right choice."
        ],
        code: "# Dump live heap to file\njmap -dump:live,file=/tmp/heap.hprof <pid>\n\n# Dump everything\njmap -dump:file=/tmp/heap-full.hprof <pid>"
      },
      {
        title: "Process memory map",
        body: [
          "-clstats and -finalizerinfo give class-loader statistics and pending finalizers; for the raw address map use the OS tools (pmap on Linux)."
        ],
        code: "# Class-loader statistics\njmap -clstats <pid>\n\n# Pending finalizer info\njmap -finalizerinfo <pid>"
      }
    ],
    quickstart: [
      {
        title: "Fastest look + a dump",
        body: [
          "In under a minute you get a histogram and a dump you can hand to MAT."
        ],
        code: "jmap -histo:live <pid> | head -30\njmap -dump:live,file=/tmp/heap.hprof <pid>"
      }
    ],
    faq: [
      {
        q: "jmap vs jcmd GC.heap_dump \u2014 which is better?",
        a: "jcmd GC.heap_dump is the modern, recommended path and works uniformly with other jcmd commands. jmap's -dump is functionally equivalent and perfectly fine. Use whichever you remember."
      },
      {
        q: "Why do my -histo numbers differ between runs?",
        a: "The heap changes between the point the count is taken and when you read it; GC can run between the object snapshot and the size computation. Treat -histo as a strong signal, not a precise audit."
      },
      {
        q: "Can jmap cause pauses?",
        a: "Capturing a heap dump is not free: the JVM must serialize the object graph, which can pause GC and raise memory pressure. Do it in a quiet window and prefer -dump:live to keep the dump smaller."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "jstack",
    category: "jvm-cli",
    toolSlug: "jstack",
    h1: "jstack: Capture Thread Dumps for Hang & Deadlock Analysis",
    metaTitle: "jstack examples: thread dumps, deadlocks, and lock analysis",
    metaDescription: "jstack examples: dump thread stacks from a live JVM, find deadlocks and blocks, capture two-dump timing for hang analysis, and use the -l lock option.",
    intro: [
      "jstack prints the Java stack traces of all threads in a running JVM. It is the essential tool for hang and deadlock investigations: when a service stops responding, a thread dump shows exactly where every thread is blocked, waiting on a lock, or spinning.",
      "The modern equivalent via jcmd is Thread.print; whichever you use, the investigation technique \u2014 take two or three dumps a few seconds apart and diff them \u2014 is what matters most."
    ],
    useWhen: [
      "A service looks hung \u2014 take a thread dump and see what each thread is doing.",
      "You suspect a deadlock: jstack prints 'Found one Java-level deadlock' when it detects one.",
      "You need to know if threads are blocked on a monitor or waiting on a condition (matched with the -l option)."
    ],
    avoidWhen: [
      "You need heap layout (use jmap or jcmd GC.heap_dump).",
      "You need ongoing profiling rather than a snapshot (use JFR/async-profiler)."
    ],
    basics: [
      {
        title: "Dump all threads",
        body: [
          "Print the stack of every thread. Redirect to a file for repeated dumps you can diff."
        ],
        code: "# Full dump to stdout\njstack <pid>\n\n# With lock info, to a file\njstack -l <pid> > threads-$(date +%s).txt\n\n# Same thing via jcmd\njcmd <pid> Thread.print -l"
      },
      {
        title: "Detect deadlocks",
        body: [
          "jstack automatically scans for cyclic lock waits and reports the implicated threads in its output."
        ],
        code: "jstack <pid> | grep -A 10 -i 'deadlock'"
      },
      {
        title: "Recommended hang-investigation cadence",
        body: [
          "Take dumps a few seconds apart. If the same threads are stuck in the same frames across dumps, it is almost certainly a hang, not a transient wait."
        ],
        code: "for i in 1 2 3; do\n  jstack <pid> > threads-$i.txt\n  sleep 5\ndone\ndiff <(cut -c1-120 threads-1.txt) <(cut -c1-120 threads-2.txt)"
      },
      {
        title: "What a hung thread looks like",
        body: [
          "Look for threads in RUNNABLE spinning in the same method, or WAITING/blocked on a monitor that is never released. HEAD of the stack is where the thread is now; the 'at' frames below show the call path."
        ]
      }
    ],
    quickstart: [
      {
        title: "Investigate a hang in 30 seconds",
        body: [
          "Two dumps + a diff."
        ],
        code: "jstack <pid> > t1.txt\nsleep 5\njstack <pid> > t2.txt\ndiff t1.txt t2.txt"
      }
    ],
    faq: [
      {
        q: "Hold on, do I use jstack or jcmd Thread.print?",
        a: "Both produce thread dumps. jcmd Thread.print -l is the modern form and plays nicely with other jcmd commands. jstack remains fine and is heavily used in existing runbooks."
      },
      {
        q: "Why take two dumps for a hang?",
        a: "A single dump can catch a thread in a momentary wait. Two dumps seconds apart that agree are strong evidence the threads are genuinely stuck, not just momentarily paused."
      },
      {
        q: "Can I read the dump without line numbers?",
        a: "Running jstack -l and using a tool like TDA (Thread Dump Analyzer) or the thread-dump views in JMC/VisualVM makes large dumps far easier to scan."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "jstat",
    category: "jvm-cli",
    toolSlug: "jstat",
    h1: "jstat: Live JVM Statistics for GC and Class-Loading",
    metaTitle: "jstat examples: GC stats, class loading, and compilation rates",
    metaDescription: "jstat examples: sample live GC counts and times, class-loading and JIT stats from a running JVM with -gcutil, -gc, -class and interval loops.",
    intro: [
      "jstat prints live JVM statistics \u2014 garbage-collection counts and times, class-loading, and JIT-compilation rates \u2014 for a local JVM. Because it is command-line and cheap, it is ideal for sampling a process in a tight loop to see how the heap and collector are trending.",
      "The most useful invocations combine a statistic with an interval: the classic jstat -gcutil <pid> 1000 10 prints GC-utilization percentages every second for ten samples."
    ],
    useWhen: [
      "You want a quick, scriptable check that a JVM is stabilizing (flat heap) or degrading (growing heap / rising GC time).",
      "You need to see live GC counts/times without enabling JMX or an agent.",
      "You want to sample class-loading or JIT activity over a window."
    ],
    avoidWhen: [
      "You need event-level detail (GC reasons, allocation sites) \u2014 use JFR/JMC.",
      "The JVM is remote; jstat is for local processes (use jstatd or JMX for remote)."
    ],
    basics: [
      {
        title: "GC utilization over time",
        body: [
          "-gcutil shows per-generation percentages. The classic loop: sample every second, 10 times. Rising S0/S1 and Old numbers with repeated full GCs say 'pressure'."
        ],
        code: "# Every 1s, 10 samples\njstat -gcutil <pid> 1000 10"
      },
      {
        title: "GC counts and times",
        body: [
          "-gc adds raw counts and accumulated times for each event type. Columns ending in C/O/U are capacity/used; FGC/FGCT are full-GC count and total time."
        ],
        code: "jstat -gc <pid> 1000 10"
      },
      {
        title: "Class-loading and JIT stats",
        body: [
          "-class shows loaded/unloaded classes; -compiler shows JIT start, compiled-method counts, and (on some JVMs) failed compilations."
        ],
        code: "jstat -class <pid>\njstat -compiler <pid>"
      },
      {
        title: "A watch loop for 'is it leaking?'",
        body: [
          "Watch Old-gen usage trend steadily upward across many samples \u2014 a classic leak fingerprint. Combine with -gcutil."
        ],
        code: "watch -n 5 \"jstat -gcutil <pid>\""
      }
    ],
    quickstart: [
      {
        title: "Confirm a JVM is healthy",
        body: [
          "Sample GC utilization for 20 seconds and look for a stable, non-flatlining heap."
        ],
        code: "jstat -gcutil <pid> 1000 20"
      }
    ],
    faq: [
      {
        q: "How do I read -gcutil columns?",
        a: "S0/S1 = survivor space utilization %, E = Eden %, O = Old gen %, M = metaspace %, CCS = compressed class space %. YGC/YGCT = young GC count/total time, FGC/FGCT = full GC count/time, GCT = total GC time."
      },
      {
        q: "jstat is empty or says the process is not a HotSpot VM \u2014 why?",
        a: "jstat needs a HotSpot JVM and a local attach path. It cannot inspect OpenJ9/other VMs, and remote processes are out of scope (use jstatd or JMX)."
      },
      {
        q: "What sample interval matters?",
        a: "For trend detection use 5-10s intervals over minutes; for a live-debug snapshot use 1s. Intervals shorter than ~100ms can add noise and pressure."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "async-profiler",
    category: "profiling",
    toolSlug: "async-profiler",
    h1: "async-profiler: Sampled CPU, Allocations and Flame Graphs",
    metaTitle: "async-profiler tutorial: CPU and allocation flame graphs with examples",
    metaDescription: "async-profiler tutorial: install, profile CPU and allocations, dump flame graphs, convert to JFR, and use it inside IntelliJ IDEA on any JVM.",
    intro: [
      "async-profiler is the de-facto standard sampling profiler for the JVM. Unlike instrumenting profilers, it uses AsyncGetCallTrace and perf-event sampling to record stack traces without stopping the world, so overhead stays low even on hot production paths. It also produces the flame graphs famously used for CPU and allocation visualization.",
      "You can run it as a standalone agent (async-profiler -p <pid> ...), or use it inside flight-recorder integration and IntelliJ IDEA's bundled profiler, which wraps it."
    ],
    useWhen: [
      "You need to find which methods actually consume CPU in a production-like workload.",
      "You want to see allocation sites and native stack frames (like JIT/GC related?) \u2014 async-profiler is one of the few profilers that captures native stacks cleanly.",
      "You want flame graphs without a commercial license or an instrumentation-based profiler."
    ],
    avoidWhen: [
      "You need always-on continuous recording (prefer JFR, which is bundled and designed for that).",
      "You only need heap-leak 'dominators' (Eclipse MAT is the tool)."
    ],
    basics: [
      {
        title: "Download and check the agent",
        body: [
          "The project ships prebuilt agents for common platforms. Managed profilers (IntelliJ, JMC) bundle an async-profiler agent for you."
        ],
        code: "# Download release from GitHub releases (async-profiler-x.y-linux-x64.tar.gz)\ntar xzf async-profiler*.tar.gz\n./profiler.sh -v"
      },
      {
        title: "Profile CPU for a fixed duration",
        body: [
          "Record 30 seconds of CPU samples, then collect the flame graph HTML. -d is duration, -f is output file, -e cpu selects the event."
        ],
        code: "# Profile the JVM with PID <pid> for 30s\n./profiler.sh -d 30 -f /tmp/flame.html -e cpu <pid>\n\n# Open /tmp/flame.html in a browser"
      },
      {
        title: "Allocation profiling",
        body: [
          "Switch the event to alloc to show allocation counts and sizes per call path (uses -Xint sampling by allocation)."
        ],
        code: "./profiler.sh -d 30 -f /tmp/alloc.html -e alloc <pid>"
      },
      {
        title: "Emit JFR-compatible output",
        body: [
          "Generate a .jfr file you can open in JDK Mission Control as an alternative to the HTML flame graph."
        ],
        code: "./profiler.sh -d 30 -o jfr -f /tmp/cpu.jfr <pid>"
      },
      {
        title: "Use it inside IntelliJ IDEA",
        body: [
          "IntelliJ's Run > 'Profile <main>' uses async-profiler under the hood and opens flame graphs in the IDE. This is the lowest-friction path for most developers."
        ]
      }
    ],
    quickstart: [
      {
        title: "First CPU flame graph in one command",
        body: [
          "Point it at a running JVM and open the result."
        ],
        code: "# In the async-profiler directory\n./profiler.sh -d 30 -f ~/flame.html -e cpu <pid>\nopen ~/flame.html"
      }
    ],
    faq: [
      {
        q: "Where is async-profiler bundled so I don't download it?",
        a: "IntelliJ IDEA's built-in profiler, JetBrains Runtime tools, and several APM products package async-profiler. If you manage a plain JDK, download the release tarball or use your package manager (many distros ship 'async-profiler')."
      },
      {
        q: "CPU vs allocation profiling \u2014 when?",
        a: "CPU profiling answers 'where does the time go' for hot loops and steady-state workloads. Allocation profiling answers 'where do objects come from' and is the first stop for GC-pressure/leak suspects."
      },
      {
        q: "Does async-profiler work on containerized/k8s JVMs?",
        a: "Yes \u2014 attach by PID works as long as you run it in the same container/namespace as the JVM (or the host can reach /proc/<pid>). On cgroup-limited environments, ensure /proc and perf permissions are available."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "visualvm",
    category: "profiling",
    toolSlug: "visualvm",
    h1: "VisualVM: All-in-One Monitoring, Thread & Heap Analysis",
    metaTitle: "VisualVM tutorial: monitor, profile and analyze heap+thread dumps",
    metaDescription: "VisualVM tutorial: attach to local/remote JVMs, view heap and GC charts, take and open thread dumps, and do basic CPU/memory sampling.",
    intro: [
      "VisualVM is a visual tool that bundles many JDK diagnostics into one GUI: live heap and GC charts, CPU/memory sampling, thread and heap dump viewing, and JFR/GC-log analysis. It historically shipped with the JDK and remains popular because it needs no agent and covers the common diagnostics in one window.",
      "Since JDK 9 the JDK no longer bundles VisualVM, but the standalone build (from visualvm.github.io) is free and connects to local and remote JVMs over the attach mechanism or JMX."
    ],
    useWhen: [
      "You want a zero-agent GUI that monitors local JVMs and opens thread/heap dumps.",
      "You want quick CPU or memory sampling without installing another profiler.",
      "You're exploring a heap dump or thread dump quickly before going deep in MAT."
    ],
    avoidWhen: [
      "You need deep production CPU profiles with native stacks \u2014 prefer async-profiler.",
      "You need fine-grained memory-leak dominators \u2014 Eclipse MAT is stronger."
    ],
    basics: [
      {
        title: "Launch and attach",
        body: [
          "Install from the website, then launch. The 'Local' tree lists attachable JVMs on the same machine; 'Remote' nodes connect via jstatd or JMX."
        ],
        code: "# Start VisualVM (from the unpacked directory)\n./bin/visualvm"
      },
      {
        title: "Monitor overview charts",
        body: [
          "The Monitor tab shows live heap, metaspace, classes, and thread counts, plus CPU usage. This is the fastest 'is my JVM healthy' view."
        ]
      },
      {
        title: "Take a thread dump",
        body: [
          "Right-click a process and choose Thread Dump; VisualVM opens it in a tree with expandable stack frames. Save as .txt for sharing."
        ]
      },
      {
        title: "Take / open a heap dump",
        body: [
          "Right-click -> Heap Dump captures a .hprof and opens it: browse instances, run a basic leak-suspect scan, and query with the built-in OQL console."
        ]
      },
      {
        title: "Sampling vs profiling tab",
        body: [
          "The Profiler tab lets you start CPU or Memory sampling on a live process, then shows hot methods / allocation counts per class."
        ]
      }
    ],
    quickstart: [
      {
        title: "Monitor + a thread dump in a minute",
        body: [
          "Launch, attach, and grab a dump."
        ],
        code: "./bin/visualvm\n# File > Add JMX Connection or click a process under Local"
      }
    ],
    faq: [
      {
        q: "Is VisualVM still maintained?",
        a: "Yes \u2014 the open-source project releases regularly from visualvm.github.io. It is the community-maintained successor to the JDK-bundled tool and works with current JDKs."
      },
      {
        q: "VisualVM vs JMC vs async-profiler?",
        a: "VisualVM = quick all-in-one monitoring + dump viewing. JMC = deep analysis of JFR recordings and live processes. async-profiler = raw sampling flame graphs. They overlap but each has a strength; many teams keep VisualVM for day-to-day and JMC for JFR."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "jmc",
    category: "profiling",
    toolSlug: "jmc",
    h1: "JDK Mission Control (JMC): Analyze JFR Recordings & Live JVMs",
    metaTitle: "JDK Mission Control tutorial: read JFR recordings, flame graphs, lock & GC views",
    metaDescription: "JDK Mission Control tutorial: open and analyze JFR .jfr files, flame graphs, allocation, lock and GC pause views, and connect to live JVMs.",
    intro: [
      "JDK Mission Control (JMC) is the rich analysis client for Java Flight Recorder data. It opens .jfr recordings and shows flame graphs, allocation and lock profiles, GC pause timelines, and exception/latency breakdowns \u2014 turning raw JFR events into a decision-ready view.",
      "JMC also connects to live JVMs via JMX and has long been the standard way to make sense of the 'black box' JFR produces in production."
    ],
    useWhen: [
      "You have a .jfr recording (from jcmd JFR.start or -XX:StartFlightRecording) and need to analyze it.",
      "You want flame graphs, GC pause views, and lock/allocation analysis on JFR data.",
      "You need to inspect a live JVM via JMX with charts and triggers."
    ],
    avoidWhen: [
      "You haven't got an agent-free quick look \u2014 VisualVM connects with fewer moving parts if all you need is a monitor.",
      "You need Java-stack sampling only for a release investigation \u2014 async-profiler might fit better."
    ],
    basics: [
      {
        title: "Open a recording",
        body: [
          "Launch JMC and open a .jfr file; the automated analysis gives a prioritized list of findings (e.g., long GC pauses, lock contention) plus manual views."
        ],
        code: "# Launch JMC (bundled with Oracle JDK or from the openjdk/jmc releases)\njmc"
      },
      {
        title: "Flame view",
        body: [
          "The Flame View renders the sampled stack top-down so you can see where CPU or allocations concentrate across the whole recording."
        ]
      },
      {
        title: "GC pause view",
        body: [
          "The Garbage Collection view plots pause duration and heap used over time \u2014 quickly spot stop-the-world spikes and their cause (young vs old GC, concurrent phases)."
        ]
      },
      {
        title: "Lock & exceptions",
        body: [
          "JFR's latency/lock events are surfaced as contention and object-wait analysis plus exception breakdowns, helping you find blocked threads and hot exceptions."
        ]
      },
      {
        title: "Trend across recordings",
        body: [
          "JMC has an automated analysis report that compares findings; use it as the first read of any new recording."
        ]
      }
    ],
    quickstart: [
      {
        title: "Record then analyze",
        body: [
          "Capture a JFR file from a live JVM and open it in JMC."
        ],
        code: "jcmd <pid> JFR.start duration=60s filename=/tmp/app.jfr\njmc /tmp/app.jfr"
      }
    ],
    faq: [
      {
        q: "Is JMC free?",
        a: "Yes. The openjdk/jmc project is open source and the Oracle JDK ships it; standalone builds are available from the project's GitHub releases for any JDK."
      },
      {
        q: "JMC without JFR?",
        a: "JMC has JMX connection features too, but its headline value is JFR analysis. If you have no JFR recording, start one with jcmd JFR.start."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "eclipse-mat",
    category: "memory",
    toolSlug: "eclipse-mat",
    h1: "Eclipse MAT: Find Memory Leaks in Java Heap Dumps",
    metaTitle: "Eclipse MAT tutorial: leaks suspect, dominators, OQL, path to GC roots",
    metaDescription: "Eclipse MAT tutorial: load a heap dump, run the Leak Suspects report, use the Dominator Tree and OQL, and find what holds objects to GC roots.",
    intro: [
      "Eclipse Memory Analyzer (MAT) is the standard tool for analyzing Java heap dumps. Its headline artifacts are two reports \u2014 the Leak Suspects overview and the Dominator Tree \u2014 that together tell you which objects suck up memory and what is anchoring them to the GC roots.",
      "You feed it a .hprof dump (from jmap -dump:live or jcmd GC.heap_dump) and its size-of and dominator calculations quickly separate 'huge legitimate cache' from 'objects that should have been freed'. OQL lets you write queries when the reports aren't enough."
    ],
    useWhen: [
      "You have an OutOfMemoryError or a steadily-growing Old-gen and need to find the culprit.",
      "You want to quantify what individual class instances actually cost (shallow vs retained size).",
      "You want to see the path from a GC root to a big object ('why is this still reachable')."
    ],
    avoidWhen: [
      "You need a live-heap histogram only \u2014 jmap -histo or jcmd snippets are faster.",
      "Your problem is GC *behavior* rather than a stale object graph \u2014 GC log analysis is the tool."
    ],
    basics: [
      {
        title: "Capture a dump and open it",
        body: [
          "MAT consumes standard .hprof dumps. Capture with jmap or jcmd, launch MAT, and File > Open Heap Dump."
        ],
        code: "jcmd <pid> GC.heap_dump /tmp/heap.hprof\n# or\njmap -dump:live,file=/tmp/heap.hprof <pid>"
      },
      {
        title: "Leak Suspects report",
        body: [
          "MAT's Overview runs an automated Leak Suspects analysis listing the top 'suspects' \u2014 big accumulations with their GC-root path. Start here on any dump."
        ]
      },
      {
        title: "Dominator Tree vs Histogram",
        body: [
          "Histogram (class-by-class counts/sizes) is a first scan. The Dominator Tree shows retained-size dominance \u2014 which objects, if freed, would free the most memory. Switch between them with the toolbar."
        ]
      },
      {
        title: "Path to GC Roots",
        body: [
          "For any object, right-click to see the path from a GC root. This answers 'why is this still alive' \u2014 classic causes are static collections, ThreadLocal, listener registries, and Caches with long TTLs."
        ]
      },
      {
        title: "OQL for custom queries",
        body: [
          "OQL (Object Query Language) is SQL-like. SELECT * FROM instanceof java.lang.String, or filter instances of your own classes."
        ],
        code: "SELECT * FROM java.util.ArrayList\nSELECT sum(o.@retainedHeapSize) FROM instanceof com.example.CacheEntry o"
      }
    ],
    quickstart: [
      {
        title: "From dump to suspect in 3 clicks",
        body: [
          "Open the dump and read the automated overview."
        ],
        code: "# 1) capture\njcmd <pid> GC.heap_dump /tmp/heap.hprof\n# 2) open in MAT\n# 3) Overview > Leak Suspects"
      }
    ],
    faq: [
      {
        q: "Shallow vs retained size?",
        a: "Shallow size is the object's own footprint (header + fields). Retained size is what would be freed if this object (and its exclusively-reachable children) were collected. Retained size is what leaks analysis cares about."
      },
      {
        q: "Dump too big / parsing timeout?",
        a: "MAT can run out of heap parsing huge dumps itself. Increase MAT's -Xmx (e.g., edit MemoryAnalyzer.ini to -Xmx8g) and prefer -dump:live (smaller) dumps for leak searches."
      },
      {
        q: "MAT vs VisualVM heap dump?",
        a: "VisualVM opens dumps for quick instance browsing; MAT is purpose-built for leak/dominance analysis with retained sizes. Use MAT for real forensics."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "gc-log-analysis",
    category: "memory",
    toolSlug: "gcviewer",
    h1: "GC Log Analysis: Read JVM Garbage-Collection Logs with GCViewer & gceasy",
    metaTitle: "GC log analysis guide: enable GC logs, read -Xlog:gc, use GCViewer and gceasy",
    metaDescription: "GC log analysis guide: enable GC logging on modern JDKs, read -Xlog:gc output, and analyze pause/throughput with GCViewer and gceasy.",
    intro: [
      "When a JVM shows excessive GC time or long pauses, the GC log is where the evidence lives. On modern JDKs (9+) GC logging is enabled with -Xlog, and the output can be graphed with GCViewer (a small Java tool) or uploaded to gceasy for an annotated report.",
      "GC log analysis answers two questions: 'how much time is spent collecting' (throughput) and 'how long are individual pauses' (latency). That pairing is what tells you whether to change heap size, switch collectors (G1/ZGC/Shenandoah), or fix an allocation pattern."
    ],
    useWhen: [
      "You see rising response-time percentiles and suspect GC pauses.",
      "You want to quantify GC throughput and p99 pauses over a window.",
      "You are comparing heap sizes or collector choices and want a numeric before/after."
    ],
    avoidWhen: [
      "Your issue is a stale heap (leak), not GC behavior \u2014 heap-dump analysis is the tool."
    ],
    basics: [
      {
        title: "Enable GC logging (JDK 9+)",
        body: [
          "Use a Unified Logging -Xlog tag selector. A common production setting writes to a rolling file with rotation and includes the GC timestamps and safe-point info."
        ],
        code: "java -Xlog:gc*,gc+metaspace,gc+ref=info:file=gc.log:time,uptime,level,tags -jar app.jar"
      },
      {
        title: "Enable GC logging (JDK 8)",
        body: [
          "Older style, still valid: -XX:+PrintGCDetails with timestamps and dates."
        ],
        code: "java -XX:+PrintGCDetails -XX:+PrintGCDateStamps -Xloggc:gc.log -jar app.jar"
      },
      {
        title: "Read the raw log",
        body: [
          "Each GC line shows a pause (Pause Young / Pause Full), heap before->after, and the GC cause or reason. Look for frequent Full GCs and long 'Pause Full (Allocation Failure)' entries."
        ],
        code: "# Show the line type breakdown\ngrep -Eo 'Pause (Young|Full)[^]]*' gc.log | sort | uniq -c | sort -rn"
      },
      {
        title: "Analyze with GCViewer",
        body: [
          "Open the .log in GCViewer for charts of pause time, heap usage and throughput, plus summary metrics like total pauses and max pause. Great when you have an offline log."
        ]
      },
      {
        title: "Analyze with gceasy",
        body: [
          "Upload a GC log to gceasy.io for an instant, annotated report: GC throughput %, worst GC pause, GC heap usage trends, and tuning hints \u2014 no local install."
        ]
      }
    ],
    quickstart: [
      {
        title: "Minimal comparison run",
        body: [
          "Capture a log, read the two numbers that matter the most."
        ],
        code: "java -Xlog:gc=info:file=gc.log -jar app.jar\n# then\ngrep -E 'Pause (Full|Young)' gc.log | wc -l"
      }
    ],
    faq: [
      {
        q: "What does GC throughput of 99% mean?",
        a: "Throughput = (wall time - GC pause time) / wall time. 99% means 1% of time was paused; below ~97% starts to hurt p99 latency. It answers 'how much time is wasted' not 'are pauses noticeable'."
      },
      {
        q: "Modern collector to try for low latency?",
        a: "ZGC and Shenandoah target sub-millisecond pauses at the cost of some throughput. If GC pressure is allocation-driven, G1 well-tuned usually suffices; measure before switching."
      },
      {
        q: "My log shows constant Full GCs \u2014 what next?",
        a: "Check the heap after each Full GC: if it keeps growing to near max before each collection, look for a leak (heap dump + MAT). If it returns to a low baseline but still Full GCs often, the heap is too small \u2014 raise -Xmx or tune G1."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "byte-buddy",
    category: "bytecode",
    toolSlug: "byte-buddy",
    h1: "Byte Buddy: Runtime Class Generation & Proxies",
    metaTitle: "Byte Buddy tutorial: generate classes and proxies at runtime with Java",
    metaDescription: "Byte Buddy tutorial: create dynamic proxies and classes at runtime, intercept methods, and understand when it beats raw ASM.",
    intro: [
      "Byte Buddy is the modern, high-level library for generating and transforming Java classes at runtime. Its fluent API lets you describe 'a class that intercepts method X with logic Y' in readable Java, and it compiles that to bytecode \u2014 without you touching opcodes.",
      "It sits on top of ASM but raises the ergonomics enormously, which is why it underlies mocking (Mockito), APM agents, and ORM providers. Use Byte Buddy when you need dynamic proxies, interceptors, or generated types and do not want to hand-write bytecode."
    ],
    useWhen: [
      "You need runtime proxies or to intercept method calls in your own library.",
      "You're building an agent that instruments classes (the Byte Buddy agent is a thin but complete wrapper).",
      "You want reliable runtime class generation without writing ASM by hand."
    ],
    avoidWhen: [
      "You only want a few proxies \u2014 consider the JDK's built-in java.lang.reflect.Proxy for interface proxies.",
      "You must hand-optimize generated bytecode tightly \u2014 raw ASM gives more control but more code."
    ],
    basics: [
      {
        title: "Add the dependency",
        body: [
          "Byte Buddy is on Maven Central. Use stub jars (net.bytebuddy:byte-buddy-agent) or the single jar; for agents you'll also want byte-buddy-agent."
        ],
        code: "// Maven\n<dependency>\n  <groupId>net.bytebuddy</groupId>\n  <artifactId>byte-buddy</artifactId>\n  <version>1.14.19</version>\n</dependency>"
      },
      {
        title: "A first generated class",
        body: [
          "The canonical \"Hello World\" of Byte Buddy: define a class, define a method, and call through reflection or a loaded class."
        ],
        code: "Class<?> loaded = new ByteBuddy()\n  .subclass(Object.class)\n  .method(ElementMatchers.named(\"toString\"))\n  .intercept(FixedValue.value(\"Hello from Byte Buddy\"))\n  .make()\n  .load(getClass().getClassLoader())\n  .getLoaded();\n\nObject o = loaded.getDeclaredConstructor().newInstance();\nSystem.out.println(o); // prints: Hello from Byte Buddy"
      },
      {
        title: "Method interception with arguments",
        body: [
          "Use MethodDelegation to route calls to a plain Java interceptor that reads the arguments \u2014 the pattern behind proxies, decorators and AOP."
        ],
        code: "class Interceptor {\n  static String greet(@AllArguments Object[] args) {\n    return \"hi \" + args[0];\n  }\n}\n\nClass<?> proxy = new ByteBuddy()\n  .subclass(Service.class)\n  .method(ElementMatchers.named(\"greet\"))\n  .intercept(MethodDelegation.to(Interceptor.class))\n  .make().load(getClass().getClassLoader()).getLoaded();"
      },
      {
        title: "Premain agent for instrumentation",
        body: [
          "To instrument classes at load time (agent use case), the byte-buddy-agent artifact provides a premain that wires Byte Buddy to transform classes on load."
        ],
        code: "public static void premain(String arg, Instrumentation inst) {\n  new AgentBuilder.Default()\n    .type(ElementMatchers.nameStartsWith(\"com.example.\"))\n    .transform((b, type, cl, m, pd) ->\n       b.method(ElementMatchers.any()).intercept(\n         Advice.to(MyAdvice.class)))\n    .installOn(inst);\n}"
      }
    ],
    quickstart: [
      {
        title: "Proxied method in ten lines",
        body: [
          "Subclass, intercept by name, call it."
        ],
        code: "Class<?> proxy = new ByteBuddy()\n  .subclass(Service.class)\n  .method(ElementMatchers.named(\"greet\"))\n  .intercept(MethodDelegation.to(Interceptor.class))\n  .make().load(getClass().getClassLoader()).getLoaded();\nSystem.out.println(((Service)proxy.newInstance()).greet(\"world\"));"
      }
    ],
    faq: [
      {
        q: "Byte Buddy vs raw ASM?",
        a: "Byte Buddy wraps ASM and adds a fluent API, automatic generation of correctly balanced code, and helper advice via annotations. You still drop to ASM when you need maximum control or micro-optimized bytecode; most dynamic-proxy workloads never need to."
      },
      {
        q: "Does Byte Buddy support Java 21+?",
        a: "Yes \u2014 it tracks current JDK releases with a monthly cadence. The latest versions support record classes, sealed types, and virtual threads."
      },
      {
        q: "Why use it instead of JDK Proxy?",
        a: "JDK Proxy only proxies interfaces and requires an invocation handler per call. Byte Buddy subclasses concrete classes, generates code optimized per interception point, and supports agents \u2014 giving better performance and more flexibility."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "maven-vs-gradle",
    category: "build",
    toolSlug: "gradle",
    h1: "Maven vs Gradle: How to Choose a JVM Build Tool",
    metaTitle: "Maven vs Gradle: differences, performance, and how to choose",
    metaDescription: "Maven vs Gradle compared: XML vs Groovy/Kotlin DSL, convention vs flexibility, incremental builds, dependency caching, and which to pick for your project.",
    intro: [
      "Maven and Gradle dominate JVM builds. Maven is the battle-tested convention-over-configuration workhorse with a massive plugin ecosystem and predictable XML POMs. Gradle offers more flexibility and generally faster incremental builds via a Groovy or Kotlin DSL, plus first-class handling of multi-module and Android projects.",
      "The choice is rarely 'which is technically better' \u2014 it's 'what does your team and ecosystem standardize on.' This page gives you the decision factors and the honest trade-offs, with pointers to the real command-line tools you will use."
    ],
    useWhen: [
      "Maven: your team values strict conventions, stable plugin behavior, and a widely understood format; or you must integrate with enterprise tooling that assumes Maven.",
      "Gradle: you need incremental build speed, custom build logic, multi-module builds, or Android; or you prefer a programmatic (DSL) rather than declarative build."
    ],
    avoidWhen: [
      "You want the absolute simplest possible build \u2014 look at JBang or the JDK's source-file mode before pulling in a full build system."
    ],
    basics: [
      {
        title: "Core commands side by side",
        body: [
          "Both tools expose familiar lifecycle-equivalent commands; the ergonomics differ only in syntax."
        ],
        code: "# Maven\nmvn clean test\nmvn package\nmvn dependency:tree\n\n# Gradle\n./gradlew test\n./gradlew build\n./gradlew dependencies"
      },
      {
        title: "Configuration: POM XML vs Groovy/Kotlin DSL",
        body: [
          "Maven expresses builds declaratively in pom.xml. Gradle expresses them programmatically, so custom logic, conditionals, and plugins read like code and are easier to compose."
        ],
        code: "<!-- pom.xml -->\n<dependency>\n  <groupId>org.junit.jupiter</groupId>\n  <artifactId>junit-jupiter</artifactId>\n  <version>5.10.2</version>\n  <scope>test</scope>\n</dependency>"
      },
      {
        title: "Performance: why Gradle is usually faster",
        body: [
          "Gradle caches task outputs and supports incremental builds and build caching out of the box, so re-runs skip unchanged work. Maven re-executes by default unless you add caching, though a good Maven profile is still fine for CI."
        ]
      },
      {
        title: "Speed vs predictability",
        body: [
          "That flexibility cuts both ways: Gradle builds can become hard to reason about at scale, while Maven's conventions keep projects boringly predictable. Choose the one that matches the team's risk tolerance."
        ]
      }
    ],
    quickstart: [
      {
        title: "Initialize a project",
        body: [
          "Both make it easy to scaffold."
        ],
        code: "# Maven\nmvn archetype:generate -DgroupId=com.example -DartifactId=demo\n\n# Gradle\ngradle init --type java-application"
      }
    ],
    faq: [
      {
        q: "Which is faster for CI?",
        a: "Gradle generally wins on incremental and parallel builds and has built-in build/output caching across machines. For tiny single-module projects the difference is negligible."
      },
      {
        q: "Can a project use both?",
        a: "It's rare and usually a migration state. The practical answer: pick one and standardize; both resolve dependencies from Maven Central and can consume the other's published artifacts."
      },
      {
        q: "Is Maven dying?",
        a: "No. Maven remains the enterprise default and its plugin ecosystem is enormous. Gradle is dominant for Android and many modern open-source projects, but 'boring and predictable' keeps Maven very much alive."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "asm",
    category: "bytecode",
    toolSlug: "asm",
    h1: "ASM: Read and Rewrite Java Bytecode",
    metaTitle: "ASM tutorial: read, analyze and rewrite class file bytecode",
    metaDescription: "ASM tutorial: the low-level bytecode library used across the JVM ecosystem \u2014 read class files, generate method code, and transform loaded classes.",
    intro: [
      "ASM is the bedrock bytecode library on the JVM \u2014 the JDK itself uses it internally, as do countless frameworks and APM agents. It reads .class files event-by-event and lets you emit or modify bytecode directly with a tiny footprint and zero dependencies.",
      "Where Byte Buddy gives you a fluent high-level API, ASM gives you the opcodes. It is the right tool when you need precise, fast class rewriting or code generation and can tolerate writing the lower-level visitors."
    ],
    useWhen: [
      "You need to modify class files at build time or load time (agents, build plugins).",
      "You're generating small, tight bytecode and want full control over each instruction.",
      "You want to analyze class structure (methods, fields, annotations) programmatically."
    ],
    avoidWhen: [
      "You want a readable, high-level API for dynamic proxies \u2014 Byte Buddy is friendlier."
    ],
    basics: [
      {
        title: "Read a class with a ClassReader",
        body: [
          "Crucial for bytecode understanding: visit methods and print the disassembly. The tree API (ClassNode) is more convenient for most rewriting than the event visitor API."
        ],
        code: "ClassReader cr = new ClassReader(inputStream);\nClassNode cn = new ClassNode();\ncr.accept(cn, 0);                       // parse\nfor (MethodNode m : cn.methods) {\n  System.out.println(m.name + m.desc);  // descriptor = signature\n}"
      },
      {
        title: "Generate a method with a ClassWriter",
        body: [
          "Emit instructions with the visitor pattern. ASM provides an mnemonics helper (MathOps, InsnList) so opcodes are typed rather than raw bytes."
        ],
        code: "ClassWriter cw = new ClassWriter(0);\ncw.visit(Opcodes.V1_8, ACC_PUBLIC, \"com/example/Hello\",\n         null, \"java/lang/Object\", null);\nMethodVisitor mv = cw.visitMethod(ACC_PUBLIC, \"run\", \"()V\", null, null);\nmv.visitCode();\nmv.visitInsn(RETURN);\nmv.visitMaxs(0, 1);\nmv.visitEnd();\nbyte[] bytes = cw.toByteArray();"
      },
      {
        title: "Transform on load with a Java agent",
        body: [
          "Use a ClassFileTransformer in a premain to rewrite bytes for every matching class loaded by the JVM \u2014 the hook ASM-based agents use to instrument applications."
        ],
        code: "public byte[] transform(Module mod, ClassLoader cl,\n    String name, Class<?> cf, ProtectionDomain pd, byte[] bytes) {\n  if (!name.startsWith(\"com/example/\")) return bytes;\n  ClassReader cr = new ClassReader(bytes);\n  ClassWriter cw = new ClassWriter(0);\n  cr.accept(new MyClassVisitor(cw), 0);\n  return cw.toByteArray();\n}"
      }
    ],
    quickstart: [
      {
        title: "Disassemble any class",
        body: [
          "Read and dump the constant pool and instructions."
        ],
        code: "ClassNode cn = new ClassNode();\nnew ClassReader(bytes).accept(cn, 0);\nSystem.out.println(cn.name);\ncn.methods.forEach(m -> System.out.println(m.name + m.desc));"
      }
    ],
    faq: [
      {
        q: "ASM vs Byte Buddy?",
        a: "Byte Buddy is built on ASM. Use Byte Buddy for dynamic proxies and ergonomic code generation; use ASM directly for maximal control, minimal footprint, or when you're instrumenting at the instruction level."
      },
      {
        q: "Does ASM keep up with new JDKs?",
        a: "Yes \u2014 new ASM versions support each new class-file version, including records, sealed classes, pattern matching, and virtual-thread-related updates. Match the ASM major version to your class-file target."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "jmh",
    category: "testing",
    toolSlug: "jmh",
    h1: "JMH: Write Correct Java Microbenchmarks",
    metaTitle: "JMH tutorial: microbenchmark Java code without JIT pitfalls",
    metaDescription: "JMH tutorial: set up, write and run correct microbenchmarks, avoid JIT dead-code elimination and warm-up traps, and read the results.",
    intro: [
      "JMH (Java Microbenchmark Harness) is the OpenJDK project's tool for writing correct microbenchmarks. Reasoning about JVM performance by hand is hopeless \u2014 the JIT compiles, inlines, and eliminated code, and naive stopwatch loops get optimized to nothing. JMH handles warm-up, dead-code elimination, black-holes, and forking so your numbers mean something.",
      "It runs from a standalone right-jar or via Maven/Gradle plugins. The golden rules: black-hole every result, warm up genuinely, and never draw conclusions you didn't measure."
    ],
    useWhen: [
      "You need a trustworthy number for a hot code path or an algorithm comparison.",
      "You're choosing between two implementations and want an apples-to-apples measurement.",
      "You want to regression-test performance (speed compiler optimizations into CI)."
    ],
    avoidWhen: [
      "You need throughput under real concurrency/load \u2014 that's a load test (Gatling/k6), not a microbenchmark.",
      "You just need to know which method is hot in a big app \u2014 profile with async-profiler instead."
    ],
    basics: [
      {
        title: "Scaffold a benchmark",
        body: [
          "JMH best works as a separate module or even a standalone main. The maven archetype is the fastest start."
        ],
        code: "mvn archetype:generate \\\n  -DarchetypeGroupId=org.openjdk.jmh \\\n  -DarchetypeArtifactId=jmh-java-11-archetype \\\n  -DgroupId=com.example -DartifactId=bench"
      },
      {
        title: "A minimal benchmark",
        body: [
          "Annotate methods with @Benchmark. Use a Blackhole to consume results so the JIT cannot void them."
        ],
        code: "@Benchmark\n@BenchmarkMode(Mode.Throughput)\n@Fork(2)\n@Warmup(iterations = 3, time = 1)\n@Measurement(iterations = 5, time = 1)\npublic void sumLoop(Blackhole bh) {\n  long acc = 0;\n  for (int i = 0; i < 1000; i++) acc += i;\n  bh.consume(acc);\n}"
      },
      {
        title: "Run and read",
        body: [
          "Run via the class with main (each @Benchmark is a separate measurement set). The output prints a score with the chosen Mode and unit (e.g., ops/ns for Throughput)."
        ],
        code: "mvn package\njava -jar target/benchmarks.jar"
      },
      {
        title: "Blackhole \u2014 the rule you can't skip",
        body: [
          "A plain loop that returns nothing or whose result is unused is dead code the JIT removes. blackhole.consume(x) forces the result to be observed, and blackhole.consumeCPU(int) burns time to shape loop bodies without producing observable values."
        ]
      }
    ],
    quickstart: [
      {
        title: "Measure a tiny method",
        body: [
          "Write, build, run."
        ],
        code: "@Benchmark public void twice(Blackhole bh) {\n  bh.consume(computeDouble());\n}\n\njava -jar target/benchmarks.jar"
      }
    ],
    faq: [
      {
        q: "Why is my naive loop showing zero time?",
        a: "The JIT detected the computation has no side effects and eliminated it. That's precisely why JMH forces you to consume results with a Blackhole \u2014 otherwise the benchmark measures nothing."
      },
      {
        q: "What do forks, warmup, measurement mean?",
        a: "Fork runs the benchmark in a fresh JVM (isolating JIT state). Warmup iterates untouched samples to let the JIT settle before timing. Measurement timing runs follow. The defaults are good; change them when you need higher variance control."
      },
      {
        q: "Should every project microbenchmark?",
        a: "No \u2014 microbenchmarks are for hot, stable, isolated code. For whole-app performance use a profiler, then microbenchmark only the identified hotspots."
      }
    ],
    updated: "August 2026"
  }
];
var GUIDES = [
  {
    slug: "jvm-flags",
    category: "jvm-cli",
    title: "JVM Flags: The Practical Tuning Guide",
    metaTitle: "JVM flags: the practical guide with examples (-Xmx, -XX, -Xlog)",
    metaDescription: "Understand and tune JVM flags: heap sizing (-Xmx/-Xms), default -XX settings, GC and JFR flags, how to inspect and mutate flags with jinfo and jcmd.",
    intro: [
      "Every JVM behavior you can influence \u2014 heap size, collector choice, GC logging, JFR \u2014 is a command-line flag or a runtime-mutable flag. The painful part is that most tuning advice is folklore, so this guide focuses on the flags you will actually set, how to see what's in effect, and how to change them on a running process.",
      "Modern Java (9+) also has Unified Logging (-Xlog) and, since JDK 11, flags you can flip live with jinfo and jcmd -XX external commands \u2014 but never confuse 'set a flag live' with 'tune correctly.' Measure before and after."
    ],
    sections: [
      {
        title: "The flags you'll actually set",
        body: [
          "These cover 95% of production tuning. Get these right before touching exotic -XX flags."
        ],
        code: "java -Xms2g -Xmx2g \\          # initial & max heap\n     -XX:+UseG1GC \\            # collector (G1 default in LTS 11/17/21)\n     -XX:MaxMetaspaceSize=512m \\ # bound metaspace\n     -Xlog:gc*:file=gc.log:time,level,tags \\ # GC log (JDK 9+)\n     -jar app.jar",
        table: {
          cols: [
            "Flag",
            "What it does",
            "Common value"
          ],
          rows: [
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
        title: "See what a JVM actually started with",
        body: [
          "Write good flags in the run script and verify with the runtime \u2014 not memory."
        ],
        code: "# Effective flags of a live JVM\njcmd <pid> VM.flags\njinfo -flags <pid>\n\n# Just the GC collector / max heap\njcmd <pid> VM.flags | grep -iE 'UseG1|MaxHeap|Metaspace'"
      },
      {
        title: "Change flags on a running JVM",
        body: [
          "Some flags are manageable at runtime via jinfo -flag and jcmd; others require a restart. Always confirm the flag is manageable before relying on a live tweak."
        ],
        code: "# Toggle a boolean or set a string flag live\njinfo -flag +PrintGC <pid>\njcmd <pid> VM.set_flag MaxGCPauseMillis 150"
      },
      {
        title: "Tuning workflow (not folklore)",
        body: [
          "Baseline first, then change one variable. GC logging + a profiler give you before/after numbers."
        ],
        code: "# 1) baseline with GC log\njava -Xlog:gc*:file=gc-baseline.log:time,level,tags -jar app.jar\n# 2) profile hot methods\n# 3) change ONE flag, repeat, compare"
      },
      {
        title: "Flags to be careful with",
        body: [
          "Avoid cargo-cult -XX flags like -XX:+UseConcMarkSweepGC (removed in JDK 14). Prefer the defaults unless you have a measured reason. -XX:+TieredCompilation, -XX:+UseZGC etc. all have trade-offs."
        ]
      }
    ],
    faq: [
      {
        q: "Should -Xms equal -Xmx?",
        a: "Setting them equal avoids heap-grow/shrink resizes and pauses, and is standard for stable services. If you want headroom for spikes, a separate max can help but costs resize work."
      },
      {
        q: "Where do I put flags that changes are permanent?",
        a: "In the JVM launch command (run script, container spec, or service manager's Java opts) \u2014 not only live via jinfo \u2014 so the config survives restarts and is reviewable."
      },
      {
        q: "Does GC flag tuning still matter with ZGC/Shenandoah?",
        a: "Less so \u2014 low-pause collectors remove most 'tune G1 to reduce full GCs' drama. Tuning shifts to heap sizing, region sizing, and metaspace caps."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "heap-dump-analysis",
    title: "Heap Dump Analysis: From OutOfMemoryError to Root Cause",
    metaTitle: "Heap dump analysis guide: capture, open and find memory leaks",
    metaDescription: "Step-by-step heap dump analysis: capture with jmap/jcmd, enable -XX:+HeapDumpOnOutOfMemoryError, open in Eclipse MAT, and use OQL to find leaks.",
    intro: [
      "A heap dump is a snapshot of every object in the JVM's heap at a moment in time. When memory grows or the process dies with OutOfMemoryError, the dump is the definitive evidence: which objects exist, how big they are, and what keeps them alive.",
      "This guide walks the full path \u2014 enabling automatic dumps, capturing manually, opening in Eclipse MAT, and turning a 'could be a leak' into a named class, an allocation site, and a fix."
    ],
    sections: [
      {
        title: "Enable automatic dump on OOM",
        body: [
          "Best insurance: tell the JVM to dump the heap the moment it dies from OOM, so you always have a forensic artifact."
        ],
        code: "java -Xmx2g \\\n  -XX:+HeapDumpOnOutOfMemoryError \\\n  -XX:HeapDumpPath=/var/log/app.hprof \\\n  -jar app.jar"
      },
      {
        title: "Capture manually with jmap/jcmd",
        body: [
          "Useful for investigating high heap before it OOMs. Find the PID, then dump live (reachable) objects."
        ],
        code: "jps -l\njcmd <pid> GC.heap_dump /tmp/heap.live.hprof\n# or\njmap -dump:live,file=/tmp/heap.live.hprof <pid>"
      },
      {
        title: "Open and read with Eclipse MAT",
        body: [
          "Launch MAT and File > Open Heap Dump. Start with the Overview > Leak Suspects, then drill into the Dominator Tree and Path to GC Roots."
        ],
        code: "# Launch MAT\nMemoryAnalyzer /tmp/heap.live.hprof"
      },
      {
        title: "Find the leak with a 2-dump diff",
        body: [
          "The classic trick: dump at T1 and T2 over a growing window. If a class's retained size roughly doubles with your growth rate, you've located the accumulation."
        ],
        code: "jcmd <pid> GC.heap_dump /tmp/h1.hprof\n# ... run the workload ...\njcmd <pid> GC.heap_dump /tmp/h2.hprof\n# In MAT: compare the Histograms or use the 'Compare' delta tool"
      },
      {
        title: "Write an OQL query",
        body: [
          "OQL filters instances when the reports are too broad \u2014 e.g., list all your cache entries over a size threshold."
        ],
        code: "SELECT * FROM com.example.CacheEntry o WHERE o.@retainedHeapSize > 1048576"
      }
    ],
    faq: [
      {
        q: "Live vs full dump \u2014 which do I capture?",
        a: "Live (reachable) is smaller and shows what the app is actually holding. Full includes finalizable/garbage candidates and is used to inspect unreachable-but-uncollected objects. Start with live."
      },
      {
        q: "Heap dump causes a pause \u2014 is that OK?",
        a: "Capturing opens the object graph, which adds memory pressure and can cause GC pauses. On production, prefer -XX:+HeapDumpOnOutOfMemoryError (only fires at death) or schedule a manual capture."
      },
      {
        q: "What if the dump is huge and MAT runs out of heap?",
        a: "Raise MAT's own -Xmx in MemoryAnalyzer.ini (e.g., -Xmx8g), and capture live dumps to keep the file manageable."
      }
    ],
    updated: "August 2026"
  },
  {
    slug: "thread-dump-analysis",
    title: "Thread Dump Analysis: Diagnose Hangs and Deadlocks",
    metaTitle: "Thread dump analysis guide: capture, read and find deadlocks",
    metaDescription: "Read Java thread dumps to find hangs, deadlocks and blocked threads: capture with jstack/jcmd, identify thread states, and spot the culprit stack.",
    intro: [
      "A thread dump shows every thread in the JVM at an instant: its state (RUNNABLE, WAITING, BLOCKED, TIMED_WAITING), its lock if it's waiting, and its full stack. It is the primary evidence for hangs, deadlocks, and 'why is nothing happening' questions.",
      "The skill is pattern recognition: a handful of thread dumps taken a few seconds apart, plus knowledge of the states, turns a cryptic stack into a named culprit almost every time."
    ],
    sections: [
      {
        title: "Capture two or three dumps",
        body: [
          "One dump can catch transients; two-to-three a few seconds apart confirm a genuine hang."
        ],
        code: "for i in 1 2 3; do\n  # modern: jcmd Thread.print -l ; classic: jstack -l\n  jcmd <pid> Thread.print -l > threads-$i.txt\n  sleep 5\ndone\n# diff normalized lines to see what didn't move\ndiff <(cut -c1-140 threads-1.txt) <(cut -c1-140 threads-2.txt)"
      },
      {
        title: "Read the thread states",
        body: [
          "Each thread line starts with its name and state. RUNNABLE at high CPU = working (or spinning); WAITING/TIMED_WAITING = parked on a monitor or lock; BLOCKED = contending for a monitor owned by another thread."
        ],
        table: {
          cols: [
            "State",
            "Meaning",
            "Action"
          ],
          rows: [
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
        title: "Find the deadlock",
        body: [
          "jstack prints 'Found one Java-level deadlock' with the implicated threads and the lock cycle automatically. If it's not detected, look for two threads each holding a lock the other wants."
        ],
        code: "jstack <pid> | grep -A 15 -i deadlock"
      },
      {
        title: "Spot the common hang culprits",
        body: [
          "Blocked on an InputStream/socket read, on a connection pool lock, or inside an RMI/Object wait \u2014 these match symptom to subsystem. Pair the stuck frame with the owning thread's stack to see the full picture."
        ]
      },
      {
        title: "Tooling to make dumps readable",
        body: [
          "For hundreds of threads, the thread-dump view in JDK Mission Control or VisualVM, or a dedicated analyzer like TDA, collapses threads by state and flag repeats."
        ],
        code: "# Open the raw dump in JMC (File > Open) or\n# paste into a thread-dump analyzer for grouped view"
      }
    ],
    faq: [
      {
        q: "When is a thread dump the right tool versus a profiler?",
        a: "Dumps answer 'where is everyone stuck' right now. Profilers answer 'where does CPU/allocation go over time'. Hangs and deadlocks = dumps; steady-state slowness = profiler."
      },
      {
        q: "What does the default gorup '/0-0' mean in the dump?",
        a: "Thread groups are largely obsolete metadata; the group is rarely a diagnostic signal in modern JVMs. Focus on thread names, states, and stacks."
      },
      {
        q: "My dump has hundreds of threads \u2014 where do I start?",
        a: "Filter by state. A hang is usually a handful of BLOCKED threads converging on one lock, or a few RUNNABLE threads spinning. The vast majority of pool threads are TIMED_WAITING and idle."
      }
    ],
    updated: "August 2026"
  }
];

// scripts/style.ts
var STYLES = ":root{--bg:#f6f8fa;--surface:#fff;--text:#1f2633;--muted:#5a6572;--brand:#2f5ba8;--accent:#c97b3d;--border:#e2e8f0;--code-bg:#0f172a;--code-text:#e2e8f0;--radius:10px;}\n*{box-sizing:border-box;}\nbody{margin:0;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;line-height:1.65;color:var(--text);background:var(--bg);}\na{color:var(--brand);text-decoration:none;}a:hover{text-decoration:underline;}\n.container{max-width:1080px;margin:0 auto;padding:0 20px;}\n.site-header{background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:20;}\n.nav{display:flex;align-items:center;gap:4px;flex-wrap:wrap;padding:14px 0;}\n.nav-brand{font-weight:800;font-size:1.15rem;color:var(--text);margin-right:12px;display:flex;align-items:center;gap:8px;}\n.nav-brand:hover{text-decoration:none;}\n.nav-brand .logo{width:20px;height:20px;display:inline-block;background:linear-gradient(135deg,var(--brand),#6a7fdb);border-radius:5px;}\n.nav-tag{font-size:.72rem;color:var(--muted);font-weight:500;margin-right:auto;}\n.nav a.nav-link{color:var(--muted);font-weight:600;font-size:.92rem;padding:6px 10px;border-radius:7px;}\n.nav a.nav-link:hover{background:var(--bg);color:var(--text);text-decoration:none;}\n.nav a.nav-link.active{color:var(--brand);background:#eef4ff;}\n.nav-toggle-wrap{display:flex;align-items:center;gap:6px;}\n.hero{padding:56px 0 40px;text-align:center;}\n.hero h1{font-size:clamp(1.9rem,4vw,3rem);margin:0 0 12px;letter-spacing:-.02em;line-height:1.15;}\n.hero .subtitle{font-size:clamp(1rem,2vw,1.2rem);color:var(--muted);max-width:720px;margin:0 auto 28px;}\n.hero .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}\n.btn{display:inline-block;padding:11px 20px;border-radius:9px;font-weight:700;font-size:.95rem;}\n.btn-primary{background:var(--brand);color:#fff;}.btn-primary:hover{background:#274a91;text-decoration:none;}\n.btn-ghost{border:1px solid var(--border);color:var(--text);background:var(--surface);}.btn-ghost:hover{background:var(--bg);text-decoration:none;}\nmain{min-height:60vh;}\n.page-content{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 1px 3px rgba(16,24,40,.08);padding:34px 38px;margin-top:26px;}\n.page-content h1{margin-top:0;font-size:2rem;letter-spacing:-.01em;}\n.page-content h2{font-size:1.45rem;margin:2rem 0 .6rem;padding-bottom:.3rem;border-bottom:1px solid var(--border);}\n.page-content h3{font-size:1.12rem;margin:1.5rem 0 .4rem;color:#243049;}\n.page-content p{color:#333c4c;margin:.7rem 0 1rem;}\n.section-kicker{text-transform:uppercase;letter-spacing:.08em;font-size:.75rem;font-weight:700;color:var(--brand);margin-bottom:4px;}\n.breadcrumbs{font-size:.85rem;color:var(--muted);margin:20px 0 -8px;}\n.breadcrumbs a{color:var(--muted);}.breadcrumbs a:hover{color:var(--brand);}\n.breadcrumbs .sep{margin:0 6px;color:#b5bfcc;}\n.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;}\n.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:0 1px 3px rgba(16,24,40,.08);display:flex;flex-direction:column;transition:transform .12s,box-shadow .12s;}\n.card:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(16,24,40,.12);}\n.card h3{margin:0 0 6px;font-size:1.05rem;}\n.card p{color:var(--muted);font-size:.9rem;margin:0 0 12px;flex:1;}\n.card .meta{font-size:.75rem;color:var(--muted);}\nul.tools{list-style:none;padding:0;margin:0;}\n.tool-item{display:flex;gap:14px;padding:16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);margin-bottom:12px;box-shadow:0 1px 3px rgba(16,24,40,.08);align-items:flex-start;}\n.tool-item .body{flex:1;}\n.tool-item h3{margin:0 0 4px;font-size:1.05rem;}\n.tool-item p{margin:2px 0 6px;color:var(--muted);font-size:.92rem;}\n.tool-item .tags{font-size:.75rem;color:var(--muted);}\n.tag{display:inline-block;background:#eef4ff;color:var(--brand);border-radius:5px;padding:1px 8px;font-weight:600;margin-right:6px;}\npre{background:var(--code-bg);color:var(--code-text);padding:16px 18px;border-radius:9px;overflow-x:auto;font-size:.86rem;line-height:1.6;margin:12px 0 18px;}\ncode{font-family:SFMono-Regular,ui-monospace,Cascadia Code,Menlo,Consolas,monospace;}\np code,li code{background:#eef1f6;color:#b0406c;padding:1px 6px;border-radius:5px;font-size:.88em;}\n.tbl-wrap{overflow-x:auto;margin:14px 0 18px;}\ntable{border-collapse:collapse;width:100%;font-size:.9rem;}\nth,td{text-align:left;padding:9px 12px;border:1px solid var(--border);}\nth{background:#f4f6f9;font-weight:700;}\n.callout{border-left:4px solid var(--brand);background:#eef4ff;padding:12px 16px;border-radius:0 8px 8px 0;margin:16px 0;font-size:.93rem;}\n.callout.warn{border-left-color:var(--accent);background:#fdf3ea;}\n.faq details{border:1px solid var(--border);border-radius:9px;padding:12px 16px;margin-bottom:10px;background:var(--surface);}\n.faq summary{font-weight:700;cursor:pointer;font-size:.98rem;}\n.faq details p{margin:10px 0 2px;color:#3b4454;}\n.cat-chip{display:inline-block;background:#eef4ff;color:var(--brand);font-weight:700;font-size:.75rem;padding:3px 10px;border-radius:20px;}\n.updated{color:var(--muted);font-size:.83rem;margin-top:10px;font-style:italic;}\n.site-footer{border-top:1px solid var(--border);background:var(--surface);margin-top:60px;padding:28px 0;text-align:center;color:var(--muted);font-size:.88rem;}\n.site-footer .links{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;}\n.site-footer a{color:var(--muted);font-weight:600;}.site-footer a:hover{color:var(--brand);}\nbody.dark-mode{--bg:#0f1419;--surface:#161d26;--text:#e6edf5;--muted:#94a2b3;--border:#263241;--code-bg:#0b1016;}\nbody.dark-mode .page-content p,body.dark-mode .page-content li{color:#c7d2df;}\nbody.dark-mode .page-content h3{color:#dbe6f2;}\nbody.dark-mode p code,body.dark-mode li code{background:#232e3c;color:#e58db0;}\nbody.dark-mode th{background:#1c2531;}\nbody.dark-mode .tool-item h3,body.dark-mode .card h3,body.dark-mode .tool-item a,body.dark-mode .card a{color:#dbe6f2;}\nbody.dark-mode .callout{background:#1a2740;}\nbody.dark-mode .callout.warn{background:#2b2217;border-left-color:#d8924a;}\nbody.dark-mode .tag{background:#1a2740;color:#8fb0ff;}\nbody.dark-mode .cat-chip{background:#1a2740;color:#8fb0ff;}\n.cta-band{background:linear-gradient(135deg,#1c2b4a,#2f5ba8);color:#fff;border-radius:var(--radius);padding:38px 34px;margin:40px 0 8px;text-align:center;box-shadow:0 8px 24px rgba(16,24,40,.18);}\n.cta-band h2{margin:0 0 6px;color:#fff;font-size:1.6rem;}\n.cta-band p{color:#cdd9ee;max-width:600px;margin:0 auto 18px;}\n.cta-form{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:480px;margin:0 auto;}\n.cta-form input[type=email]{flex:1 1 220px;padding:12px 14px;border:none;border-radius:8px;font-size:.95rem;min-width:0;}\n.cta-form button{padding:12px 22px;border:none;border-radius:8px;background:#ffd166;color:#1c2b4a;font-weight:800;font-size:.95rem;cursor:pointer;}\n.cta-form button:hover{background:#ffd166;filter:brightness(1.05);}\n.cta-note{font-size:.78rem;color:#97a9cc;margin-top:12px;}\n.form-status{min-height:1.4em;font-weight:600;margin-top:8px;}\nbody.dark-mode .cta-band{background:linear-gradient(135deg,#12203a,#2a4a86);}\n@media(max-width:640px){.page-content{padding:22px 18px;}.tool-item{flex-direction:column;}.nav-tag{display:none;}.nav a.nav-link{font-size:.85rem;padding:5px 7px;}}\n";

// scripts/generate.ts
var esc = function(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var escHtml = function(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
var toolUrl = function(slug) {
  const t = TOOLS.find((x) => x.slug === slug);
  if (!t)
    return null;
  if (!DEEP_DIVES.some((d) => d.slug === slug))
    return null;
  return "/tools/" + t.category + "/" + t.slug + "/";
};
var navHTML = function(active) {
  const links = [["/", "Home"]];
  CATEGORIES.forEach((c) => links.push(["/tools/" + c.slug + "/", c.navLabel]));
  links.push(["/guides/", "Guides"], ["/books/", "Books"]);
  let h = '<nav class="nav" aria-label="Main navigation">';
  h += '<a class="nav-brand" href="/"><span class="logo" aria-hidden="true"></span>' + SITE_NAME + "</a>";
  h += '<span class="nav-tag">practical JVM tools & guides</span><span class="nav-toggle-wrap">';
  for (const l of links) {
    h += '<a class="nav-link ' + (active === l[0] ? "active" : "") + '" href="' + l[0] + '">' + l[1] + "</a>";
  }
  h += '<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></button></span></nav>';
  return h;
};
var breadcrumbs = function(pathStr, currentTitle) {
  const seg = pathStr.split("/").filter(Boolean);
  const crumbs = [{ href: "/", label: "Home" }];
  let acc = "";
  for (const s of seg) {
    acc += "/" + s;
    let lab = s;
    let href = acc + "/";
    if (s === "tools") {
      lab = "Tools";
      href = null;
    } else if (s === "guides") {
      lab = "Guides";
      href = "/guides/";
    } else if (s === "books") {
      lab = "Books";
      href = "/books/";
    } else {
      const c = CATEGORIES.find((x) => x.slug === s);
      if (c)
        lab = c.navLabel;
    }
    crumbs.push({ href, label: lab });
  }
  let h = '<nav class="breadcrumbs" aria-label="Breadcrumb">';
  for (let k = 0;k < crumbs.length - 1; k++) {
    if (crumbs[k].href) {
      h += '<a href="' + crumbs[k].href + '">' + esc(crumbs[k].label) + "</a>";
    } else {
      h += esc(crumbs[k].label);
    }
    h += '<span class="sep">/</span>';
  }
  h += "<span>" + esc(currentTitle.split(":")[0]) + "</span></nav>";
  return h;
};
var breadcrumbSchema = function(pathStr) {
  const seg = pathStr.split("/").filter(Boolean);
  const items = [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" }];
  let acc = "", pos = 2;
  for (const s of seg) {
    acc += "/" + s;
    let name = s;
    if (s === "tools")
      name = "Tools";
    else if (s === "guides")
      name = "Guides";
    else if (s === "books")
      name = "Books";
    else {
      const c = CATEGORIES.find((x) => x.slug === s);
      if (c)
        name = c.navLabel;
    }
    items.push({ "@type": "ListItem", position: pos++, name, item: SITE_URL + acc + "/" });
  }
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
};
var webSchema = function() {
  return { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL };
};
var renderPage = function(o) {
  const url = o.canonicalUrl || (o.path === "/" ? SITE_URL : SITE_URL + o.path + "/");
  let jld = "";
  if (o.jsonLd && o.jsonLd.length) {
    jld = '<script type="application/ld+json">' + JSON.stringify(o.jsonLd) + "</script>";
  }
  let h = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">';
  h += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
  h += "<title>" + esc(o.title) + "</title>";
  h += '<meta name="description" content="' + esc(o.description) + '">';
  h += '<link rel="canonical" href="' + esc(url) + '">';
  if (o.noindex)
    h += '<meta name="robots" content="noindex">';
  h += '<meta property="og:type" content="website"><meta property="og:site_name" content="' + SITE_NAME + '">';
  h += '<meta property="og:title" content="' + esc(o.title) + '"><meta property="og:description" content="' + esc(o.description) + '">';
  h += '<meta property="og:url" content="' + esc(url) + '"><meta name="twitter:card" content="summary">';
  h += '<meta name="twitter:title" content="' + esc(o.title) + '"><meta name="twitter:description" content="' + esc(o.description) + '">';
  h += '<link rel="stylesheet" href="' + CSS_HREF + '">';
  h += '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%232f5ba8%22/><text x=%2250%22 y=%2268%22 font-size=%2260%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22monospace%22>J</text></svg>">';
  h += jld + UMAMI + "</head><body>";
  h += '<header class="site-header"><div class="container">' + navHTML(o.active) + "</div></header>";
  let bread = "";
  if (o.path !== "/")
    bread = breadcrumbs(o.path, o.title);
  h += '<main class="container">' + bread + o.body + "</main>";
  h += FOOTER + DARK_SCRIPT + "</body></html>";
  return h;
};
var dirnameP = function(p) {
  return p.slice(0, Math.max(p.lastIndexOf("/"), 0));
};
var writeOut = function(rel, content2) {
  const p = join(OUT, rel);
  mkdirSync(dirnameP(p), { recursive: true });
  writeFileSync(p, content2);
};
var homepageBody = function() {
  const counts = CATEGORIES.map((c) => {
    return { cat: c, n: TOOLS.filter((t) => t.category === c.slug).length };
  });
  const featured = ["jcmd", "async-profiler", "eclipse-mat", "jfr", "visualvm", "jmh", "maven", "byte-buddy"];
  let hero = '<section class="hero">';
  hero += "<h1>JVM Tools &mdash; the practical directory for working Java developers</h1>";
  hero += '<p class="subtitle">The independent, constantly-updated reference for JVM tooling: command-line diagnostics, profilers, memory &amp; GC analysis, bytecode, build and testing tools &mdash; with real examples, not just links.</p>';
  hero += '<div class="cta-row"><a class="btn btn-primary" href="#explore">Browse tools</a><a class="btn btn-ghost" href="/guides/jvm-flags/">Start with the JVM flags guide</a></div>';
  hero += "</section>";
  let cats = '<div class="page-content" style="box-shadow:none;background:transparent;border:none;padding:0"><h2 id="explore" style="margin-top:4px">Explore by category</h2><div class="grid">';
  for (const { cat, n } of counts) {
    cats += '<div class="card"><a class="cat-chip" href="/tools/' + cat.slug + '/">' + n + " tools</a>";
    cats += '<h3 style="margin-top:8px"><a href="/tools/' + cat.slug + '/">' + esc(cat.navLabel) + "</a></h3>";
    cats += '<p style="font-size:.88rem">' + esc(cat.intro[0]) + "</p></div>";
  }
  cats += "</div></div>";
  let guides = '<section class="page-content" style="margin-top:16px"><span class="section-kicker">Guides &amp; deep-dives</span><h2 style="margin-top:6px">Practical how-tos</h2><div class="grid">';
  const allPages = [];
  GUIDES.forEach((g) => allPages.push({ href: "/guides/" + g.slug + "/", chip: "Guide", title: g.title, note: g.metaDescription }));
  const ddFeatured = DEEP_DIVES.filter((d) => ["jcmd", "jfr", "heap-dump-analysis", "thread-dump-analysis", "async-profiler"].includes(d.slug));
  for (const g of GUIDES) {
    guides += '<div class="card"><a class="cat-chip" href="/guides/' + g.slug + '/">Guide</a><h3 style="margin-top:8px"><a href="/guides/' + g.slug + '/">' + esc(g.title) + '</a></h3><p style="font-size:.88rem">' + esc(g.metaDescription) + "</p></div>";
  }
  for (const d of DEEP_DIVES) {
    if (["jcmd", "async-profiler", "eclipse-mat"].includes(d.slug)) {
      guides += '<div class="card"><a class="cat-chip" href="/tools/' + d.category + "/" + d.slug + '/">Deep-dive</a><h3 style="margin-top:8px"><a href="/tools/' + d.category + "/" + d.slug + '/">' + esc(d.h1.split(":")[0]) + '</a></h3><p style="font-size:.88rem">' + esc(d.metaDescription) + "</p></div>";
    }
  }
  guides += "</div></section>";
  let how = '<section class="page-content" style="margin-top:16px"><h2>Don&apos;t install a tool until you need it</h2>';
  how += '<p>Most JVM diagnosis starts with tools already on your path. <a href="/tools/jvm-cli/jcmd/">jcmd</a>, <a href="/tools/jvm-cli/jstat/">jstat</a>, <a href="/tools/jvm-cli/jmap/">jmap</a> and <a href="/tools/jvm-cli/jstack/">jstack</a> ship with every JDK. The trick is knowing which question you are asking:</p>';
  how += '<ul class="tools" style="list-style:none;padding:0">';
  how += '<li class="tool-item"><div class="body"><h3>Is the JVM healthy right now?</h3><p><a href="/tools/jvm-cli/jstat/">jstat -gcutil</a> plus a quick <a href="/tools/jvm-cli/jfr/">JFR</a> recording answer this in under a minute.</p></div></li>';
  how += '<li class="tool-item"><div class="body"><h3>Why is the app slow?</h3><p>Profile with <a href="/tools/profiling/async-profiler/">async-profiler</a> for a CPU flame graph; for pauses check <a href=\"/tools/memory/gc-log-analysis/\">GC log analysis</a>.</p></div></li>';
  how += '<li class="tool-item"><div class="body"><h3>Is it a memory leak?</h3><p>Capture a heap dump (<a href="/tools/jvm-cli/jmap/">jmap -dump:live</a>) and analyze it with <a href="/tools/memory/eclipse-mat/">Eclipse MAT</a>.</p></div></li>';
  how += '<li class="tool-item"><div class="body"><h3>Is it a hang or deadlock?</h3><p>Take two <a href="/guides/thread-dump-analysis/">thread dumps</a> a few seconds apart and diff them.</p></div></li>';
  how += "</ul></section>";
  let picks = '<section class="page-content" style="margin-top:16px"><h2>Quick picks: the tools most teams reach for</h2><div class="grid">';
  for (const slug of featured) {
    const u = toolUrl(slug);
    const t = TOOLS.find((x) => x.slug === slug);
    picks += '<div class="card"><h3><a href="' + u + '">' + esc(t ? t.name : slug) + "</a></h3><p>" + esc(t ? t.desc : "") + "</p></div>";
  }
  picks += "</div></section>";
  return hero + cats + guides + how + picks + ctaBand();
};
var homepage = function() {
  const body = homepageBody();
  const jsonLd = [
    webSchema(),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "JVM Tools directory",
      itemListElement: CATEGORIES.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.navLabel, url: SITE_URL + "/tools/" + c.slug + "/" }))
    }
  ];
  writeOut("index.html", renderPage({
    title: "JVM Tools - practical JVM tools, guides and resources",
    description: "The independent, practical guide to JVM tooling: jcmd, jstat, jmap, jstack, async-profiler, Eclipse MAT, JFR, GC analysis, bytecode, build and testing tools, with real command examples.",
    path: "/",
    active: "/",
    body,
    jsonLd
  }));
  console.log("-> site/index.html");
};
var categoryHub = function(cat) {
  const tools = TOOLS.filter((t) => t.category === cat.slug);
  const deeps = DEEP_DIVES.filter((d) => d.category === cat.slug);
  let items = "";
  for (const t of tools) {
    const u = toolUrl(t.slug) || t.url;
    items += '<li class="tool-item"><div class="body"><h3><a href="' + esc(u) + '">' + esc(t.name) + "</a></h3>";
    items += "<p>" + esc(t.desc) + '</p><div class="tags"><span class="tag">' + t.kind + '</span><span class="tag">' + esc(t.license) + "</span>" + (cat.slug === "jvm-cli" ? '<span class="tag">bundled with JDK</span>' : "") + "</div></div></li>";
  }
  let introHTML = '<div class="page-content"><span class="section-kicker">' + cat.navLabel + "</span><h1>" + esc(cat.title) + "</h1>";
  for (const p of cat.intro)
    introHTML += "<p>" + p + "</p>";
  introHTML += '<div class="callout"><strong>What you\'ll find here:</strong> ' + cat.bullets.join(" &middot; ") + "</div></div>";
  let listHTML = "";
  if (tools.length)
    listHTML = '<section class="page-content" style="margin-top:16px"><h2>' + esc(cat.navLabel) + ' tools</h2><ul class="tools">' + items + "</ul></section>";
  let deepHTML = "";
  if (deeps.length) {
    let dItems = "";
    for (const d of deeps)
      dItems += '<li class="tool-item"><div class="body"><h3><a href="/tools/' + cat.slug + "/" + d.slug + '/">' + esc(d.h1.split(":")[0]) + "</a></h3><p>" + esc(d.metaDescription) + "</p></div></li>";
    deepHTML = '<section class="page-content" style="margin-top:16px"><h2>In-depth guides in this category</h2><ul class="tools">' + dItems + "</ul></section>";
  }
  const body = introHTML + listHTML + deepHTML;
  const jsonLd = [
    webSchema(),
    breadcrumbSchema("/tools/" + cat.slug),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: cat.title,
      description: cat.metaDescription,
      url: SITE_URL + "/tools/" + cat.slug + "/",
      mainEntity: { "@type": "ItemList", itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: toolUrl(t.slug) || t.url, description: t.desc })) }
    }
  ];
  writeOut("tools/" + cat.slug + "/index.html", renderPage({ title: cat.metaTitle, description: cat.metaDescription, path: "/tools/" + cat.slug, active: "/tools/" + cat.slug + "/", body, jsonLd }));
  console.log("-> site/tools/" + cat.slug + "/index.html");
};
var deepDivePage = function(d) {
  const t = toolBySlug(d.toolSlug);
  const official = t ? t.url : null;
  let basics = "";
  for (const b of d.basics) {
    basics += "<h2>" + esc(b.title) + "</h2>";
    for (const p of b.body)
      basics += "<p>" + p + "</p>";
    if (b.code)
      basics += "<pre><code>" + escHtml(b.code) + "</code></pre>";
  }
  let quick = '<span class="section-kicker">Quick start</span><h2 style="margin-top:6px">Get productive in minutes</h2>';
  for (const q of d.quickstart) {
    quick += "<h3>" + esc(q.title) + "</h3>";
    for (const p of q.body)
      quick += "<p>" + p + "</p>";
    quick += "<pre><code>" + escHtml(q.code) + "</code></pre>";
  }
  let faqH = "";
  if (d.faq && d.faq.length) {
    faqH = '<section class="faq"><h2>Frequently asked questions</h2>';
    for (const f of d.faq)
      faqH += "<details><summary>" + esc(f.q) + "</summary><p>" + f.a + "</p></details>";
    faqH += "</section>";
  }
  let intro = '<div class="page-content"><span class="section-kicker">JVM tool guide &middot; ' + d.category.replace(/-/g, " ") + "</span><h1>" + esc(d.h1) + "</h1>";
  for (const p of d.intro)
    intro += "<p>" + p + "</p>";
  if (official && t)
    intro += '<p class="tags"><span class="tag">Official</span> <a href="' + esc(official) + '" rel="noopener" target="_blank">' + esc(t.name) + " project</a></p>";
  intro += "</div>";
  const uwh = '<div class="page-content" style="margin-top:16px"><div class="grid" style="grid-template-columns:1fr 1fr;gap:18px"><div><span class="section-kicker">Use it when</span>' + d.useWhen.map((u) => '<p style="margin:.5rem 0">&bull; ' + u + "</p>").join("") + '</div><div><span class="section-kicker">Skip it when</span>' + d.avoidWhen.map((a) => '<p style="margin:.5rem 0">&bull; ' + a + "</p>").join("") + "</div></div></div>";
  const basicsH = '<div class="page-content" style="margin-top:16px">' + basics + "</div>";
  const quickH = '<div class="page-content" style="margin-top:16px">' + quick + "</div>";
  const faqHOut = faqH ? '<div class="page-content" style="margin-top:16px">' + faqH + "</div>" : "";
  const upd = '<p class="updated" style="text-align:center">Last updated ' + d.updated + " &middot; " + SITE_NAME + " is independent and not affiliated with Oracle.</p>";
  const body = intro + uwh + basicsH + quickH + faqHOut + upd + ctaBand();
  const path = "/tools/" + d.category + "/" + d.slug;
  const jsonLd = [
    webSchema(),
    breadcrumbSchema(path),
    { "@context": "https://schema.org", "@type": "TechArticle", headline: d.h1, description: d.metaDescription, url: SITE_URL + path + "/", dateModified: LAST_BUILD, author: { "@type": "Organization", name: SITE_NAME }, publisher: { "@type": "Organization", name: SITE_NAME }, inLanguage: "en" },
    ...d.faq && d.faq.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []
  ];
  writeOut(path.slice(1) + "/index.html", renderPage({ title: d.metaTitle, description: d.metaDescription, path, active: "/tools/" + d.category + "/", body, jsonLd }));
  console.log("-> site" + path + "/index.html");
};
var guideIndex = function() {
  let items = "";
  for (const g of GUIDES)
    items += '<li class="tool-item"><div class="body"><h3><a href="/guides/' + g.slug + '/">' + esc(g.title) + "</a></h3><p>" + esc(g.metaDescription) + "</p></div></li>";
  const body = '<div class="page-content"><h1>JVM Guides &amp; How-tos</h1><p>Practical, example-first guides for working with the JVM: reading thread and heap dumps, tuning JVM flags, and analyzing garbage collection - real commands, not just theory.</p></div><div class="page-content" style="margin-top:16px"><ul class="tools">' + items + "</ul></div>";
  const jsonLd = [webSchema(), breadcrumbSchema("/guides"), { "@context": "https://schema.org", "@type": "ItemList", name: "JVM Guides", itemListElement: GUIDES.map((g, i) => ({ "@type": "ListItem", position: i + 1, name: g.title, url: SITE_URL + "/guides/" + g.slug + "/" })) }];
  writeOut("guides/index.html", renderPage({ title: "JVM Guides & How-tos", description: "Practical JVM guides: thread dumps, heap dumps, JVM flags, GC analysis, with real command examples.", path: "/guides", active: "/guides/", body, jsonLd }));
  console.log("-> site/guides/index.html");
};
var guidePage = function(g) {
  let secs = "";
  for (const s of g.sections) {
    secs += "<h2>" + esc(s.title) + "</h2>";
    for (const p of s.body)
      secs += "<p>" + p + "</p>";
    if (s.code)
      secs += "<pre><code>" + escHtml(s.code) + "</code></pre>";
    if (s.table) {
      secs += '<div class="tbl-wrap"><table><thead><tr>' + s.table.cols.map((c) => "<th>" + esc(c) + "</th>").join("") + "</tr></thead><tbody>" + s.table.rows.map((r) => "<tr>" + r.map((c) => "<td>" + esc(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
    }
  }
  let faqH = "";
  if (g.faq && g.faq.length) {
    faqH = '<section class="faq"><h2>Frequently asked questions</h2>';
    for (const f of g.faq)
      faqH += "<details><summary>" + esc(f.q) + "</summary><p>" + f.a + "</p></details>";
    faqH += "</section>";
  }
  const body = '<div class="page-content"><span class="section-kicker">JVM guide</span><h1>' + esc(g.title) + "</h1>" + g.intro.map((p) => "<p>" + p + "</p>").join("") + '</div><div class="page-content" style="margin-top:16px">' + secs + "</div>" + (faqH ? '<div class="page-content" style="margin-top:16px">' + faqH + "</div>" : "") + '<p class="updated" style="text-align:center">Last updated ' + g.updated + " &middot; " + SITE_NAME + " is independent and not affiliated with Oracle.</p>" + ctaBand();
  const path = "/guides/" + g.slug;
  const jsonLd = [webSchema(), breadcrumbSchema(path), { "@context": "https://schema.org", "@type": "TechArticle", headline: g.title, description: g.metaDescription, url: SITE_URL + path + "/", dateModified: LAST_BUILD, author: { "@type": "Organization", name: SITE_NAME }, publisher: { "@type": "Organization", name: SITE_NAME }, inLanguage: "en" }, ...g.faq && g.faq.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []];
  writeOut(path.slice(1) + "/index.html", renderPage({ title: g.metaTitle, description: g.metaDescription, path, active: "/guides/", body, jsonLd }));
  console.log("-> site" + path + "/index.html");
};
var booksPage = function() {
  let items = "";
  for (const b of BOOKS)
    items += '<li class="tool-item"><div class="body"><h3><a href="' + b.url + '" rel="noopener" target="_blank">' + esc(b.title) + "</a></h3><p><strong>" + esc(b.author) + "</strong> &mdash; " + esc(b.note) + "</p></div></li>";
  const body = '<div class="page-content"><h1>Recommended Books for JVM Development</h1><p>A curated reading list for understanding JVM internals, performance and Java best practices.</p></div><div class="page-content" style="margin-top:16px"><ul class="tools">' + items + "</ul></div>";
  const jsonLd = [webSchema(), breadcrumbSchema("/books"), { "@context": "https://schema.org", "@type": "ItemList", name: "JVM Books", itemListElement: BOOKS.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.title, url: b.url })) }];
  writeOut("books/index.html", renderPage({ title: "Recommended Books for JVM Development", description: "The best books for learning JVM internals, Java performance and concurrency.", path: "/books", active: "/books/", body, jsonLd }));
  console.log("-> site/books/index.html");
};
var sitemapRobots = function() {
  const paths = ["/"];
  CATEGORIES.forEach((c) => paths.push("/tools/" + c.slug + "/"));
  DEEP_DIVES.forEach((d) => paths.push("/tools/" + d.category + "/" + d.slug + "/"));
  paths.push("/guides/");
  GUIDES.forEach((g) => paths.push("/guides/" + g.slug + "/"));
  paths.push("/books/");
  let x = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for (const p of paths)
    x += "\n  <url><loc>" + SITE_URL + p + "</loc></url>";
  x += "\n</urlset>\n";
  writeOut("sitemap.xml", x);
  writeOut("robots.txt", "User-agent: *\nAllow: /\nSitemap: " + SITE_URL + "/sitemap.xml\n");
  console.log("-> site/sitemap.xml, site/robots.txt");
};
var ctaBand = function() {
  const action = SIGNUP_URL ? 'action="' + SIGNUP_URL + '" method="POST"' : 'onsubmit="return false"';
  const handler = `<script>
    (function(){
      var f=document.getElementById('jvmtool-cta-form');
      if(!f)return;
      f.addEventListener('submit',function(e){
        e.preventDefault();
        var s=document.getElementById('cta-status');
        var email=f.querySelector('input[type=email]').value;
        if(!SIGNUP_BOOL || !/\\S+@\\S+\\S+/.test(email)){ s.textContent='Coming soon - we are wiring up signups.'; return; }
        var fd=new FormData(f);
        fetch(f.action,{method:'POST',body:new FormData(f),headers:{accept:'application/json'}})
          .then(r=>{ s.textContent=r.ok?'Thanks! Check your inbox.':'Something went wrong - try again.'; if(r.ok)f.reset(); })
          .catch(()=>{ s.textContent='Something went wrong - try again.'; });
      });
    })();
  </script>`;
  return '<section class="cta-band"><h2>' + CTA_TITLE + "</h2><p>" + CTA_BODY + "</p>" + '<form id="jvmtool-cta-form" class="cta-form" ' + action + '><input type="email" name="email" placeholder="you@example.com" required><button>' + CTA_BUTTON + "</button></form>" + '<p id="cta-status" class="form-status"></p><p class="cta-note">One email. Free forever.</p>' + "<script>var SIGNUP_BOOL=" + (SIGNUP_URL ? "true" : "false") + ";</script>" + handler + "</section>";
};
var run = function() {
  rmSync(join(OUT, "tools"), { recursive: true, force: true });
  rmSync(join(OUT, "guides"), { recursive: true, force: true });
  rmSync(join(OUT, "books"), { recursive: true, force: true });
  mkdirSync(join(OUT, "assets"), { recursive: true });
  writeFileSync(join(OUT, "assets", "jvm-tools.css"), STYLES2);
  homepage();
  CATEGORIES.forEach(categoryHub);
  DEEP_DIVES.forEach(deepDivePage);
  guideIndex();
  GUIDES.forEach(guidePage);
  booksPage();
  sitemapRobots();
  console.log("\nBuild complete -> " + OUT);
};
var ROOT = process.cwd();
var OUT = ROOT;
var LAST_BUILD = "2026-08-07";
var CSS_HREF = "/assets/jvm-tools.css";
var SIGNUP_URL = null;
var CTA_TITLE = "Get the free JVM CLI cheat-sheet";
var CTA_BODY = "A one-page printable reference of the jcmd, jstat, jmap, jstack and JFR commands that solve most production problems. No spam.";
var CTA_BUTTON = "Send it to my inbox";
var UMAMI = '<script defer src="https://cloud.umami.is/script.js" data-website-id="d267be8f-610b-4f69-801b-2a4af8f1b98b"></script>';
var DARK_SCRIPT = '<script>function toggleTheme(){var b=document.body;b.classList.toggle("dark-mode");try{localStorage.setItem("darkMode",b.classList.contains("dark-mode"));}catch(e){}}(function(){try{if(localStorage.getItem("darkMode")==="true"){document.body.classList.add("dark-mode");}}catch(e){}})();</script>';
var FOOTER = '<footer class="site-footer"><div class="links"><a href="/">Home</a><a href="/guides/">Guides</a><a href="/books/">Books</a><a href="' + GITHUB_REPO + '" rel="noopener" target="_blank">GitHub</a></div><div>&copy; 2024 &ndash; 2026 ' + SITE_NAME + '. Built by hand, served fast. &middot; <a href="' + GITHUB_REPO + '" rel="noopener">Contribute</a></div></footer>';
var BOOKS = [
  { title: "Java Performance: The Definitive Guide", author: "Scott Oaks", url: "https://www.oreilly.com/library/view/java-performance-the/9781449363512/", note: "The practical performance bible - profiling, GC and JIT explained with real data." },
  { title: "Effective Java", author: "Joshua Bloch", url: "https://www.oreilly.com/library/view/effective-java-3rd/9781492069669/", note: "Third edition - the canonical set of best practices for robust, idiomatic Java." },
  { title: "Java Concurrency in Practice", author: "Brian Goetz et al.", url: "https://www.oreilly.com/library/view/java-concurrency-in/9780321349606/", note: "The definitive concurrency book - essential for reading thread dumps and writing correct parallel code." },
  { title: "Inside the Java Virtual Machine", author: "Bill Venners", url: "https://www.artima.com/insidejvm/ed2/", note: "A classic deep dive into class files, bytecode and JVM internals." }
];
var STYLES2 = STYLES;
run();
