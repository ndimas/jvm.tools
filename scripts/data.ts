// ============================================================
// JVM Tools — Content model & catalog
// Edit this file to add/update tools, then run:
//   bun scripts/generate.ts
// ============================================================

export const SITE_NAME = "JVM Tools";
export const SITE_TAGLINE = "The practical directory of Java Virtual Machine tools, guides, and resources for working JVM developers.";
export const SITE_URL = "https://jvm.tools";
export const SITE_DOMAIN = "jvm.tools";
export const GITHUB_REPO = "https://github.com/ndimas/jvm.tools";
export const AUTHOR = "JVM Tools";

// ------------------------------------------------------------------
// Categories (hub pages). slug becomes /tools/<slug>/
// ------------------------------------------------------------------
export interface Category {
  slug: string;
  navLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];          // prose paragraphs
  bullets: string[];        // quick "what you'll find" list
}

export const CATEGORIES: Category[] = [
  {
    slug: "jvm-cli",
    navLabel: "JVM CLI",
    title: "JVM Command-Line Tools",
    metaTitle: "JVM Command-Line Tools (jcmd, jstat, jmap, jstack) — The Complete Guide",
    metaDescription: "The definitive guide to the JVM tools shipped with the JDK: jcmd, jstat, jmap, jstack, jps, jinfo, jfr and more, with real command examples for diagnosis and tuning.",
    intro: [
      "Every JDK ships with a set of diagnostic and management command-line tools that live inside the bin/ directory. Because they travel with the runtime, they are the first tools you should reach for when a Java process misbehaves: they cost nothing, require no agent or instrumentation, and work almost everywhere.",
      "These tools talk to a running JVM through the Java Attach API (the same mechanism the jcmd, jps and jinfo tools use), or operate directly on saved artifacts such as heap dumps and thread dumps. Mastering a handful of them covers most day-to-day diagnosis: finding a process (jps), dumping threads (jstack), sampling the heap (jmap), inspecting flags (jinfo) and triggering diagnostics (jcmd).",
      "Below is every bundled tool worth knowing, with the commands that actually matter.",
    ],
    bullets: [
      "See what's running: jps, jcmd -l",
      "Trigger diagnostics & dump threads/heaps: jcmd, jfr",
      "Inspect live statistics: jstat, jinfo",
      "Capture thread and heap artifacts for offline analysis",
    ],
  },
  {
    slug: "profiling",
    navLabel: "Profiling",
    title: "JVM Profilers & Performance Analysis Tools",
    metaTitle: "Best JVM Profilers (async-profiler, VisualVM, JFR, JMC) Compared",
    metaDescription: "Compare the best JVM profilers and performance tools: async-profiler, Java Flight Recorder, JDK Mission Control, YourKit, VisualVM and more, with guidance on when to use each.",
    intro: [
      "When a Java service is slow, a profiler tells you where the CPU time and allocations actually go instead of wherever a hunch points. Modern JVM profiling has largely converged on two complementary techniques: sampled async profiling (async-profiler) and events recorded by the JVM itself (Java Flight Recorder).",
      "This hub compares the practical options — from the free, bundled and open-source tools to the commercial IDEs — and links to real quick-starts for the ones that matter most.",
    ],
    bullets: [
      "Start here with async-profiler for CPU & allocation flame graphs",
      "Use Java Flight Recorder (JFR) for zero-overhead, always-on recording",
      "Open JFR recordings and thread dumps in JDK Mission Control",
      "Compare VisualVM, YourKit and IDE-integrated profilers",
    ],
  },
  {
    slug: "memory",
    navLabel: "Memory",
    title: "JVM Memory & Garbage Collection Tools",
    metaTitle: "JVM Memory, Heap Dump & GC Analysis Tools (MAT, jmap, GCViewer)",
    metaDescription: "Tools to analyze Java heap dumps, object allocation and garbage collection logs: Eclipse MAT, jmap, GCViewer, gceasy and more, with real usage examples.",
    intro: [
      "OutOfMemoryError reports, growing heap graphs in your monitoring, and slowly-rotting response times are usually signs one of two things: a leak, or excessive garbage-collection pressure. The tools in this category are how you turn those symptoms into an exact cause.",
      "Two distinct workflows matter here. Heap-dump analysis answers 'what is holding onto this memory' (Eclipse MAT, jmap -dump). GC log / GC behavior analysis answers 'why is the collector working so hard' (GCViewer, gceasy, -Xlog:gc). Most teams need both.",
    ],
    bullets: [
      "Capture a heap dump: jmap -dump:live, /diagnostic/jmap/status",
      "Find leaks & dominators with Eclipse MAT",
      "Analyze GC logs with GCViewer or gceasy",
      "Understand modern collectors: G1, ZGC, Shenandoah, Parallel",
    ],
  },
  {
    slug: "bytecode",
    navLabel: "Bytecode",
    title: "Java Bytecode Manipulation & JVM Languages",
    metaTitle: "Java Bytecode Manipulation Tools (ASM, Byte Buddy) & JVM Languages",
    metaDescription: "A practical guide to manipulating Java bytecode with ASM and Byte Buddy, and the JVM languages (Kotlin, Groovy, Scala) that compile to the class-file format.",
    intro: [
      "The Java bytecode format (class files) is a stable, documented target. Because the JVM executes bytecode rather than source, any JVM language can compile to it, and runtime libraries can generate or transform classes after compilation. This is what powers proxies, ORMs, mocking frameworks and most modern frameworks' cleverness.",
      "If you need to read or transform class files directly, ASM is the low-level Swiss-army knife with the smallest dependency footprint. If you want to generate classes at runtime with a friendlier API, Byte Buddy raises the level far above raw ASM. For whole programs on the JVM, the alternative-language ecosystem (Kotlin, Groovy, Scala, Clojure) is the practical way to express more with less.",
    ],
    bullets: [
      "Low-level class-file reading & rewriting with ASM",
      "Runtime code generation & proxies with Byte Buddy",
      "Understand the class-file & verification model",
      "The JVM language ecosystem compiled to bytecode",
    ],
  },
  {
    slug: "build",
    navLabel: "Build",
    title: "JVM Build & Dependency Management Tools",
    metaTitle: "JVM Build Tools: Maven vs Gradle, JDK tooling (jlink, JBang)",
    metaDescription: "Compare JVM build and packaging tools — Apache Maven, Gradle, sbt, Bazel and JBang — plus the JDK packaging tools jlink, jpackage and sdks.",
    intro: [
      "A modern JVM project is built by one of a small set of tools: Maven and Gradle dominate, with sbt and Bazel in specific niches. All of them orchestrate compilation, testing, packaging and dependency resolution against repositories such as Maven Central.",
      "Beyond the build orchestrators, the JDK itself ships packaging and modularization tools — jlink for custom runtimes, jpackage for native installers, jmod for module files — that have grown far more important since the modularization of Java 9. The growth of single-file Java (java Source.java, JBang) has also changed what 'a build tool' has to be for small projects and prototypes.",
    ],
    bullets: [
      "Maven vs Gradle: how to choose for a project",
      "jlink & jpackage for small, distributable runtimes",
      "JBang and source-file mode for scripts and prototypes",
      "Dependency repositories and consistency: Maven Central, lockfiles",
    ],
  },
  {
    slug: "testing",
    navLabel: "Testing",
    title: "JVM Testing & Microbenchmark Tools",
    metaTitle: "JVM Testing Tools: JUnit 5, Testcontainers, Mockito, JMH",
    metaDescription: "The practical toolkit for testing and benchmarking JVM software: JUnit 5, Testcontainers, Mockito, AssertJ, Arquillian, Gatling, and JMH for microbenchmarks.",
    intro: [
      "Test-driven code on the JVM rests on a durable core of tooling: a test framework (JUnit 5 or TestNG), an assertion library (AssertJ), and a mocking library (Mockito). Around that core, Testcontainers lets you spin up real infrastructure for integration tests, and JMH is the only sane way to microbenchmark code on a modern JIT-compiled JVM.",
      "For performance and load, Gatling and k6 cover scenario-based load testing. Because the JVM's JIT compiler makes naive benchmarking meaningless, JMH deserves special attention whenever you need a measured number.",
    ],
    bullets: [
      "Unit tests: JUnit 5, TestNG, AssertJ, Mockito",
      "Integration tests with real containers: Testcontainers",
      "Microbenchmarks without JIT pitfalls: JMH",
      "Load & API testing: Gatling, k6",
    ],
  },
  {
    slug: "kubernetes",
    navLabel: "Kubernetes",
    title: "JVM Settings & Tuning in Kubernetes",
    metaTitle: "JVM Settings in Kubernetes: Heap, GC, Limits & Flags for Pods",
    metaDescription: "The practical guide to configuring JVM settings in Kubernetes: -Xmx, GC choice, resource limits, Java container awareness, Java Flight Recorder and Prometheus in pods.",
    intro: [
      "Running Java in Kubernetes changes how you think about JVM settings. The JVM no longer sees a fixed machine — it sees the CPU and memory limits you place on the pod, and it must cope with cgroup capping, container sharding and the container's ephemeral nature. Get the memory settings wrong and you get either OOMKilled pods or heap starvation.",
      "This category covers how to reason about JVM memory and GC flags in a containerized world: how modern JDKs auto-detect container limits, how to size the heap relative to the pod memory limit, which collectors suit latency- vs throughput-bound service pods, and how to route diagnostics (JFR, Prometheus metrics) out of a pod and into your observability stack.",
    ],
    bullets: [
      "Understand container-aware JVM defaults (UseContainerSupport, MaxRAMPercentage)",
      "Size the heap safely relative to the pod memory limit",
      "Choose GC / tuning by service type: G1, ZGC, Shenandoah, Parallel",
      "Sidecars & agents: JMX exporter, JFR streaming, Prometheus",
    ],
  },
];

// ------------------------------------------------------------------
// Tools catalog (slug -> info). Edit to add/remove tools.
// ------------------------------------------------------------------
export interface Tool {
  slug: string;
  name: string;
  url: string;
  desc: string;
  category: string;
  license: string;
  kind: "bundled-jdk" | "open-source" | "commercial" | "freeware" | "managed";
}

export const TOOLS: Tool[] = [
  // ---- jvm-cli (bundled JDK tools) ----
  { slug: "jcmd", name: "jcmd", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jcmd.html", desc: "Sends diagnostic commands to a running JVM: heap dumps, thread dumps, JFR start/stop, GC.run, VM.system_properties and hundreds of others.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jps", name: "jps", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jps.html", desc: "Lists running Java processes and their VM identifiers (the `jps -lv` one-liner is how you map a PID to a JVM and its command line).", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jstat", name: "jstat", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstat.html", desc: "Prints live JVM statistics — GC counts and times, class-loading and compilation rates — in a single line, perfect for quick sampling in a loop.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jmap", name: "jmap", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jmap.html", desc: "Prints a process's memory map and heap summary, and can dump the heap to a file (jmap -dump) for offline analysis in Eclipse MAT.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jstack", name: "jstack", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jstack.html", desc: "Dumps the thread stacks of a running JVM to stdout or a file, the raw material for deadlock and hang analysis.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jinfo", name: "jinfo", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jinfo.html", desc: "Prints or changes system properties and JVM flags of a running process (update a flag that is mutable at runtime, or read what a process actually started with).", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jfr", name: "java -XX:StartFlightRecording / jfr", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jfr.html", desc: "Java Flight Recorder: records profiling events (CPU, allocations, GC, locks, exceptions) with low overhead; `jfr` reads and prints .jfr recordings after the fact.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jshell", name: "jshell", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jshell.html", desc: "The Java REPL introduced in JDK 9, for trying snippets and exploring APIs interactively before putting them in a file.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "javap", name: "javap", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/javap.html", desc: "The class-file disassembler: shows class signatures, constant pools, and bytecode, invaluable for understanding what the compiler actually emitted.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jlink", name: "jlink", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jlink.html", desc: "Assembles a custom, minimal JVM runtime image with only the modules your application needs; the backbone of small 'slim' Java distributions.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jdb", name: "jdb", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jdb.html", desc: "The Java Debugger, a command-line debugging client that attaches to a JVM started with debugging enabled. Functional but clunky; most reach for an IDE debugger.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jhsdb", name: "jhsdb", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jhsdb.html", desc: "The HotSpot debugger, a post-mortem and live forensics tool that can inspect a crashed or hung JVM via its SA (Serviceability Agent) internals.", category: "jvm-cli", license: "Oracle Free Use", kind: "bundled-jdk" },

  // ---- profiling ----
  { slug: "async-profiler", name: "async-profiler", url: "https://github.com/async-profiler/async-profiler", desc: "The de-facto standard sampled profiler: low-overhead CPU and allocation profiling with flame graphs, usable directly or inside IntelliJ and your JFR workflow.", category: "profiling", license: "Apache-2.0", kind: "open-source" },
  { slug: "visualvm", name: "VisualVM", url: "https://visualvm.github.io/", desc: "The bundled-style visual tool for profiling and monitoring local and remote JVMs: CPU/memory sampling, thread and heap dump viewing, and JFR/GC analysis.", category: "profiling", license: "GPLv2 + CE", kind: "open-source" },
  { slug: "jmc", name: "JDK Mission Control (JMC)", url: "https://github.com/openjdk/jmc", desc: "The rich client for analyzing JFR recordings and live JVMs: flame graphs, allocation and lock analysis, and GC pause views on top of Java Flight Recorder data.", category: "profiling", license: "UPL-1.0 (open)", kind: "open-source" },
  { slug: "yourkit", name: "YourKit Java Profiler", url: "https://www.yourkit.com/", desc: "A mature commercial profiler with deep allocation, lock, and JEE profiling plus out-of-the-box integrations; polished UI and low overhead.", category: "profiling", license: "Commercial (licenses + free eval)", kind: "commercial" },
  { slug: "jprofiler", name: "JProfiler", url: "https://www.ej-technologies.com/products/jprofiler/overview.html", desc: "A long-standing commercial Java profiler known for its strong CPU, memory, and JDBC/HTTP call-tree analysis and offline profiling of recorded sessions.", category: "profiling", license: "Commercial (licenses + free eval)", kind: "commercial" },
  { slug: "arthas", name: "Arthas", url: "https://arthas.aliyun.com/", desc: "Alibaba's widely used open-source JVM diagnostic tool: attach to a running JVM to watch method arguments/returns, find slow calls, detect CPU hotspots and hot methods without redeploying.", category: "profiling", license: "Apache-2.0", kind: "open-source" },
  { slug: "micrometer", name: "Micrometer", url: "https://micrometer.io/", desc: "The vendor-neutral metrics facade: instrument your JVM app once and route to Prometheus, Datadog, New Relic, Graphite or dozens of other backends.", category: "profiling", license: "Apache-2.0", kind: "open-source" },
  { slug: "jmx-exporter", name: "Prometheus JMX Exporter", url: "https://github.com/prometheus/jmx_exporter", desc: "Exposes JVM runtime metrics (heap, GC, threads, classes) as Prometheus metrics via a Java agent or standalone HTTP server; the standard bridge to Kubernetes monitoring.", category: "profiling", license: "Apache-2.0", kind: "open-source" },

  // ---- memory ----
  { slug: "eclipse-mat", name: "Eclipse MAT", url: "https://eclipse.dev/mat/", desc: "The standard heap-dump analyzer: leaks suspect report, dominator tree, OQL queries, and path-to-gc-roots to pinpoint what's holding onto memory.", category: "memory", license: "EPL-2.0", kind: "open-source" },
  { slug: "gcviewer", name: "GCViewer", url: "https://github.com/chewiebug/GCViewer", desc: "A Java tool that parses GC log files into charts of pause times, throughput and heap usage; the classic quick look at garbage collection behavior.", category: "memory", license: "LGPL-2.1", kind: "open-source" },
  { slug: "gceasy", name: "GCeasy", url: "https://gceasy.io/", desc: "Upload a GC log and get an instant, annotated analysis — pause stats, throughput, latency percentiles, and likely tuning recommendations — hosted in the browser.", category: "memory", license: "Free tier + paid", kind: "managed" },
  { slug: "jamm", name: "Java Agent for Memory Measurements (JAMM)", url: "https://github.com/jbellis/jamm", desc: "A Java agent that measures actual in-memory size of objects, including JVM per-object overhead, when you need byte-accurate 'how big is this really' answers.", category: "memory", license: "Apache-2.0", kind: "open-source" },
  { slug: "jol", name: "JOL (Java Object Layout)", url: "https://github.com/openjdk/jol", desc: "OpenJDK's tool for measuring and printing the on-heap layout and footprint of objects and arrays, useful for understanding alignment and padding costs.", category: "memory", license: "GPLv2 w/ CE", kind: "open-source" },
  { slug: "visualgc", name: "VisualGC", url: "https://visualvm.github.io/plugins.html", desc: "The classic VisualVM plugin showing live generations, spaces, and GC counts for a JVM; still the clearest quick view of how a collector is ticking.", category: "memory", license: "GPLv2 + CE", kind: "freeware" },

  // ---- bytecode ----
  { slug: "asm", name: "ASM", url: "https://asm.ow2.io/", desc: "The low-level, battle-tested bytecode library used across the whole ecosystem (every JDK since JDK 9 uses it internally) for reading and rewriting class files.", category: "bytecode", license: "BSD-3", kind: "open-source" },
  { slug: "byte-buddy", name: "Byte Buddy", url: "https://bytebuddy.net/", desc: "A high-level runtime class-generation library with a fluent API; the easiest way to create dynamic proxies, agents, and generated types without writing assembly.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "javassist", name: "Javassist", url: "https://www.javassist.org/", desc: "A bytecode toolkit that lets you edit class files using Java-source-level snippets rather than low-level opcodes; handy when ASM feels too low-level.", category: "bytecode", license: "Apache-2.0 + LGPL", kind: "open-source" },
  { slug: "cglib", name: "cglib", url: "https://github.com/cglib/cglib", desc: "The older, classic bytecode-generation library famous for powering Spring proxies; still broadly deployed, though mostly superseded by Byte Buddy.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "kotlin", name: "Kotlin", url: "https://kotlinlang.org/", desc: "The most successful JVM language besides Java; a modern, null-safe, concise language that compiles to bytecode and fully interoperates with existing Java.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "groovy", name: "Groovy", url: "https://groovy-lang.org/", desc: "A dynamic, optionally-typed JVM language with a scripting-friendly feel; compiles to bytecode and is the base of the Grails web framework.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "scala", name: "Scala", url: "https://www.scala-lang.org/", desc: "A statically-typed, functional-first JVM language; its compiler emits bytecode that interoperates with Java while enabling richer type systems.", category: "bytecode", license: "Apache-2.0", kind: "open-source" },
  { slug: "graalvm", name: "GraalVM (Truffle & native-image)", url: "https://www.graalvm.org/", desc: "Oracle's high-performance JDK featuring a polyglot interpreter (Truffle) and native-image, which compiles JVM applications ahead-of-time to native binaries.", category: "bytecode", license: "GPLv2 with CE", kind: "open-source" },

  // ---- build ----
  { slug: "maven", name: "Apache Maven", url: "https://maven.apache.org/", desc: "The longest-standing dominant build tool: convention-driven lifecycle, XML POMs, and a massive ecosystem of plugins; the default in most enterprises.", category: "build", license: "Apache-2.0", kind: "open-source" },
  { slug: "gradle", name: "Gradle", url: "https://gradle.org/", desc: "The flexible, fast, Groovy/Kotlin-DSL build tool famous for incremental builds and the de-facto choice for Android; supports both Maven and Gradle-based dependencies.", category: "build", license: "Apache-2.0", kind: "open-source" },
  { slug: "jbang", name: "JBang", url: "https://www.jbang.dev/", desc: "Runs single-file Java and JVM-language source files directly, resolving dependencies from Maven Central automatically — the modern way to script Java.", category: "build", license: "MIT", kind: "open-source" },
  { slug: "jpackage", name: "jpackage", url: "https://docs.oracle.com/en/java/javase/21/docs/specs/man/jpackage.html", desc: "The JDK tool that packages a modular app into a platform-native installer (dmg, msi, deb, rpm) containing a private runtime.", category: "build", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "sbt", name: "sbt", url: "https://www.scala-sbt.org/", desc: "The interactive Scala build tool; incremental compilers and a REPL-first workflow make it the standard for Scala projects.", category: "build", license: "Apache-2.0", kind: "open-source" },
  { slug: "bazel", name: "Bazel", url: "https://bazel.build/", desc: "Google's multi-language build system with remote caching and hermetic builds; chosen when build performance at very large scale matters.", category: "build", license: "Apache-2.0", kind: "open-source" },

  // ---- testing ----
  { slug: "junit5", name: "JUnit 5", url: "https://junit.org/junit5/", desc: "The current standard testing framework for the JVM: annotations, dynamic tests, and the Jupiter extension model; runs on the JUnit Platform.", category: "testing", license: "EPL-2.0", kind: "open-source" },
  { slug: "testng", name: "TestNG", url: "https://testng.org/", desc: "A test framework inspired by JUnit that adds parallel execution, data providers and rich configuration; a strong alternative when those matter.", category: "testing", license: "Apache-2.0", kind: "open-source" },
  { slug: "assertj", name: "AssertJ", url: "https://assertj.github.io/doc/", desc: "A fluent, rich assertion library for writing readable tests with descriptive failure messages; the standard companion to JUnit 5.", category: "testing", license: "Apache-2.0", kind: "open-source" },
  { slug: "mockito", name: "Mockito", url: "https://github.com/mockito/mockito", desc: "The most widely used mocking framework on the JVM; creates fake objects, stubs methods and verifies interactions in tests.", category: "testing", license: "MIT", kind: "open-source" },
  { slug: "testcontainers", name: "Testcontainers", url: "https://testcontainers.com/", desc: "Spins up real Docker infrastructure (databases, message brokers, browsers) for integration tests, then tears it down; makes repeatable integration testing practical.", category: "testing", license: "Apache-2.0", kind: "open-source" },
  { slug: "jmh", name: "JMH (Java Microbenchmark Harness)", url: "https://github.com/openjdk/jmh", desc: "OpenJDK's harness for writing correct microbenchmarks — it deals with warm-up, dead-code elimination and JIT effects so your numbers mean something.", category: "testing", license: "GPLv2 w/ CE", kind: "open-source" },
  { slug: "gatling", name: "Gatling", url: "https://gatling.io/", desc: "A high-performance, scenario-based load-testing tool that records realistic user flows and reports rich KPIs; easy to script in Scala or Java.", category: "testing", license: "Apache-2.0 (core)", kind: "open-source" },
  { slug: "k6", name: "Grafana k6", url: "https://k6.io/", desc: "A developer-friendly load-testing tool scripted in JavaScript that executes with a Go engine; widely used for API and k8s load testing.", category: "testing", license: "AGPL-3.0 (OSS core)", kind: "open-source" },

  // ---- kubernetes (JVM settings in K8s) ----
  { slug: "container-awareness", name: "JVM Container Awareness (UseContainerSupport)", url: "https://docs.oracle.com/en/java/javase/21/vm/container-awareness.html", desc: "Modern JDKs auto-detect cgroup CPU/memory limits inside containers, letting -XX:MaxRAMPercentage scale the heap to the pod's limit instead of the host's RAM.", category: "kubernetes", license: "Oracle Free Use", kind: "bundled-jdk" },
  { slug: "jmx-exporter-k8s", name: "Prometheus JMX Exporter (in pods)", url: "https://github.com/prometheus/jmx_exporter", desc: "A Java agent exposing JVM metrics — heap, GC, threads, classes — as Prometheus metrics, the standard sidecar-agent pattern for monitoring JVM pods.", category: "kubernetes", license: "Apache-2.0", kind: "open-source" },
  { slug: "jfr-streaming-k8s", name: "JFR Streaming & jcmd in Pods", url: "https://github.com/mihai-stsd/JFR-live", desc: "Start Java Flight Recorder recordings in a running pod with jcmd, or stream the JFR event stream live to an external analyzer — no redeploy, no agent.", category: "kubernetes", license: "Apache-2.0", kind: "open-source" },
  { slug: "jvm-exporter", name: "jvm.Stack / JVM Status", url: "https://github.com/jvm-tools/jvm_exporter", desc: "Experimental JVM binary exporter for Prometheus that mirrors a JVM's status the way node_exporter mirrors a host; useful when an agent is not possible.", category: "kubernetes", license: "Apache-2.0", kind: "open-source" },
  { slug: "kubernetes-hpa", name: "Kubernetes HPA & Metrics Server", url: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", desc: "The control loop that scales JVM pod replicas on CPU/memory (via Metrics Server) so you can only pay for the JVM capacity the traffic actually needs.", category: "kubernetes", license: "Apache-2.0", kind: "managed" },
];

// ------------------------------------------------------------------
// Deep-dive pages: real, accurate, useful content with commands.
// slug -> page. These target the high-intent "<tool> <howto>" queries.
// ------------------------------------------------------------------
export interface DeepDive {
  slug: string;            // /tools/<category>/<slug>/index.html
  category: string;        // category slug the page lives under
  toolSlug: string;        // matching Tool.slug for cross-links
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];         // prose
  useWhen: string[];       // "Use it when..."
  avoidWhen: string[];     // "Not the right tool when..."
  basics: { title: string; body: string[]; code?: string }[]; // sections w/ optional code block
  quickstart: { title: string; body: string[]; code: string }[];
  faq: { q: string; a: string }[];
  updated: string;         // freshness stamp e.g. "August 2026"
}

export const DEEP_DIVES: DeepDive[] = [];
