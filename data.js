/* Program catalog + age-based mapping for Springfield Soccer Center.
   Descriptions for the four headline programs are taken verbatim from the
   live site; the rest are written in the same concise, confident voice. */

const PROGRAMS = {
  "little-boots": {
    cat: "Foundations",
    title: "Little Boots",
    banner: "assets/banners/little-boots.png",
    age: "U3–U4",
    desc: "First touches, big smiles. A playful introduction to the ball that builds coordination and a love of the game.",
    meta: ["6 Weeks", "Saturday Mornings", "Parent & Player"],
    details: {
      tagline: "Their First Touch. Their First Love.",
      body: [
        { type: "lead", text: "The perfect first soccer experience for your youngest player. Little Boots is built around play, movement, and fun." },
        { type: "h", text: "What to Expect" },
        { type: "list", items: [
          "Ball familiarity and basic motor skills",
          "Age-appropriate games and activities",
          "Positive coaching in a fun environment",
          "Building confidence through movement",
        ] },
      ],
    },
  },
  "summer-camps": {
    cat: "Camp",
    title: "Full-Day Summer Camps",
    banner: "assets/banners/summer-camps.png",
    age: "U5–U19",
    desc: "Our flagship all-day experience packed with technical training, small-sided games, competitions, and fun—designed to keep players improving all summer long.",
    meta: ["6 Weeks", "Mon – Fri", "8:00 AM – 3:30 PM"],
    details: {
      tagline: "Six Weeks. Maximum Development.",
      body: [
        { type: "lead", text: "Our flagship summer experience — a full day of elite soccer development in an energetic, competitive environment." },
        { type: "h", text: "Daily Structure" },
        { type: "list", items: [
          "Morning technical training sessions",
          "Small-sided games and possession work",
          "Afternoon competitions and scrimmages",
          "Themed days and player challenges",
        ] },
        { type: "h", text: "Who Is This For?" },
        { type: "p", text: "Players of all levels from U5 through U19. Groups are organized by age and ability to maximize the training environment." },
      ],
    },
  },
  "pre-travel": {
    cat: "Pathway",
    title: "Pre-Travel",
    banner: "assets/banners/pre-travel.png",
    age: "U5–U8",
    desc: "The bridge to competitive play. Build the foundation, confidence, and habits to step into travel soccer ready.",
    meta: ["8 Weeks", "Once a Week"],
    details: {
      tagline: "From Recreation to Competition.",
      body: [
        { type: "lead", text: "The ideal stepping stone for players ready to make the transition from recreational to competitive soccer." },
        { type: "h", text: "Key Focus Areas" },
        { type: "list", items: [
          "Technical foundation — first touch, passing, dribbling",
          "Introduction to team shape and positioning",
          "Competitive mindset development",
          "Small-sided game application",
        ] },
      ],
    },
  },
  "omid": {
    cat: "Pro Development",
    title: "Pro Development Program",
    banner: "assets/banners/omid.png",
    age: "U5–U19",
    desc: "High-level, fast-paced training directed by Omid Namazi — technical mastery, tactical themes, and game-realistic reps in a professional environment.",
    meta: ["8 Weeks", "Tue & Wed", "4:30 – 6:45 PM"],
    details: {
      kicker: "Pro Development Program · Omid Namazi",
      tagline: "Train Like a Pro. Think Like a Pro. Become Your Best.",
      bannerPlaceholder: "Drop a banner photo — Coach Omid / pro training session",
      facts: [
        { label: "Format", value: "8-Week Pro Development Clinic" },
        { label: "Season", value: "Summer 2026" },
        { label: "Schedule", value: "Tue & Wed · 4:30–6:45 PM" },
        { label: "Age Groups", value: "U5–U19" },
        { label: "Director", value: "Omid Namazi" },
        { label: "License", value: "US Soccer Pro License" },
      ],
      body: [
        { type: "lead", text: "Join us this summer to train with one of the most experienced and respected coaches in the game through the Pro Development Program, personally directed and conducted by Omid Namazi — a US Soccer Pro License holder with experience at the professional, national team, and elite youth levels." },
        { type: "h", text: "Coaching Pedigree" },
        { type: "p", text: "Coach Namazi brings a wealth of high-level coaching experience, including serving as:" },
        { type: "list", items: [
          "Current Head Coach of DC Power FC",
          "Former coach with Hartford Athletic",
          "Former coach with Houston Dynamo",
          "Former US Youth National Team coach",
          "Former assistant coach for the Iran national football team",
          "Former Head Coach of Chicago Stars FC",
        ] },
        { type: "p", text: "This 8-week development clinic is designed to help players improve technically, tactically, and mentally in a high-energy professional training environment. Sessions are built around specific game themes and are designed to challenge players both on and off the ball." },
        { type: "h", text: "Technical Focus" },
        { type: "p", text: "Every session includes a strong technical training component focused on:" },
        { type: "list", items: ["Ball mastery", "Dribbling", "Passing", "Shooting", "Decision-making under pressure"] },
        { type: "h", text: "Tactical Themes" },
        { type: "p", text: "In addition to technical development, each session features a tactical theme focused on real-game situations, including:" },
        { type: "list", items: ["Defending as a unit", "Regaining possession", "Playing vertical quickly after winning the ball", "Attacking principles", "Transition play", "Movement and awareness"] },
        { type: "p", text: "Players will learn how to think faster, play with confidence, and understand the game at a higher level while training in small groups for maximum individual attention." },
        { type: "p", text: "Whether your child is looking to sharpen technical skills, improve tactical understanding, or prepare for the next level of competition, the Pro Development Program provides elite coaching and an environment centered on player growth and confidence." },
      ],
    },
  },
  "futsal": {
    cat: "Small-Sided",
    title: "Futsal Clinic",
    banner: "assets/banners/futsal.png",
    age: "U5–U14",
    desc: "Fast feet, tight spaces, sharper decisions. The small-sided game that forges close control and quick thinking.",
    meta: ["6 Weeks", "Friday Nights"],
    details: {
      tagline: "Small Space. Big Development.",
      body: [
        { type: "lead", text: "Futsal is one of the most effective technical development tools in the game. Fast, tight, and demanding — every touch counts." },
        { type: "h", text: "Why Futsal?" },
        { type: "list", items: [
          "Up to 6x more touches per session vs. outdoor soccer",
          "Forces quick decision-making under pressure",
          "Builds creativity and close control",
          "Used by elite programs worldwide",
        ] },
      ],
    },

  },
  "footskills": {
    cat: "Ball Mastery",
    title: "Footskills",
    banner: "assets/banners/footskills.png",
    age: "U9–U14",
    desc: "Master the fundamentals of control and dribbling through high-repetition, ball-mastery training built for real-game confidence.",
    meta: ["8 Weeks", "Once a Week"],
    details: {
      tagline: "Master the Ball. Elevate Your Game.",
      body: [
        { type: "lead", text: "A foundational technical program for players who want to significantly improve their ball mastery and confidence." },
        { type: "h", text: "What We Train" },
        { type: "list", items: [
          "Ball mastery sequences and patterns",
          "Dribbling moves and 1v1 technique",
          "Turning, receiving, and body shape",
          "Confidence in tight spaces",
        ] },
      ],
    },
  },
  "gk-brian": {
    cat: "Goalkeeping",
    title: "Goalkeeper Clinics with Brian",
    banner: "assets/banners/goalkeeper.png",
    age: "U9–U14",
    desc: "Elite goalkeeper training covering shot-stopping, positioning, distribution, and game scenarios—led by DC Power US National team coach Brian.",
    meta: ["4 Weeks", "Twice a Week"],
    details: {
      tagline: "Elite Hands. Elite Feet. Elite Mind.",
      body: [
        { type: "lead", text: "Position-specific goalkeeper training led by an elite-level coaching staff. Built for goalkeepers who are serious about their craft." },
        { type: "h", text: "Technical Curriculum" },
        { type: "list", items: [
          "Shot-stopping mechanics and footwork",
          "Distribution — kicks, throws, and short passing",
          "Positioning and angles",
          "High ball and cross handling",
          "Game scenario decision-making",
        ] },
      ],
    },
  },
  "scoring": {
    cat: "Finishing",
    title: "Art of Scoring Goals",
    banner: "assets/banners/scoring.png",
    age: "U9–U14",
    desc: "Finishing, movement, and the instinct to be in the right place. Turn chances into goals under pressure.",
    meta: ["5 Weeks", "Once a Week"],
    details: {
      tagline: "Clinical. Creative. Relentless.",
      body: [
        { type: "lead", text: "Goals win games. This clinic is dedicated entirely to the craft of finishing — the movement, the composure, the creativity." },
        { type: "h", text: "What You Will Work On" },
        { type: "list", items: [
          "Off-ball movement and attacking runs",
          "Composure and technique under pressure",
          "First-time finishing — volleys, headers, rebounds",
          "Clinical 1v1 situations",
          "Pattern play leading to goal",
        ] },
      ],
    },
  },
  "attacking-1v1": {
    cat: "Dribbling",
    title: "1v1 Attacking",
    banner: "assets/banners/attacking-1v1.png",
    age: "U9–U14",
    desc: "Beat your defender, own the moment. Develop the moves, speed, and bravery to take players on and win.",
    meta: ["5 Weeks", "Once a Week"],
    details: {
      tagline: "Beat Your Defender. Every Time.",
      body: [
        { type: "lead", text: "The ability to beat a defender in a 1v1 is one of the most valuable skills in soccer. This clinic is entirely dedicated to that art." },
        { type: "h", text: "Training Focus" },
        { type: "list", items: [
          "Explosive first step and change of direction",
          "Dribbling moves — cuts, step-overs, feints",
          "Body shape and deception",
          "Confidence under pressure",
          "Game-realistic 1v1 scenarios",
        ] },
      ],
    },
  },
  "first-touch": {
    cat: "Technical",
    title: "First Touch & Passing",
    banner: "assets/banners/first-touch.png",
    age: "U9–U14",
    desc: "Clean control and sharp distribution. Refine the two touches every great player relies on, every single game.",
    meta: ["6 Weeks", "Once a Week"],
    details: {
      tagline: "Touch. Pass. Think. Faster.",
      body: [
        { type: "lead", text: "Everything in soccer starts with your first touch. This clinic builds the technical foundation that sets elite players apart." },
        { type: "h", text: "Technical Curriculum" },
        { type: "list", items: [
          "Clean first touch in all directions",
          "Short and medium range passing",
          "Combination play and wall passes",
          "Speed of play under pressure",
          "Receiving with body turned",
        ] },
      ],
    },
  },
};

/* Three distinct development stages — no two tabs share the same program
   mix. Each supplemental block has a `kind` that drives its label + hint:
   "next" (pathway ahead), "additional" (also available), "elite" (advanced). */
const AGE_GROUPS = [
  {
    id: "all", label: "All Programs", sub: "Every Program",
    featured: ["summer-camps", "omid", "little-boots", "footskills"],
    supplemental: { kind: "additional", title: "More Programs", tag: "Also Available", ids: ["pre-travel", "futsal", "gk-brian", "scoring", "attacking-1v1", "first-touch"] },
  },
  {
    id: "u3-u4", label: "U3–U4", sub: "First Touches",
    featured: ["little-boots"],
    supplemental: { kind: "next", title: "What Comes Next", tag: "The Pathway", ids: ["pre-travel"] },
  },
  {
    id: "u5-u6", label: "U5–U6", sub: "Foundations",
    featured: ["pre-travel", "summer-camps", "futsal"],
    supplemental: { kind: "additional", title: "Additional Training", tag: "Also Available", ids: ["omid"] },
  },
  {
    id: "u7-u12", label: "U7–U12", sub: "Development",
    featured: ["summer-camps", "footskills", "omid", "futsal"],
    supplemental: { kind: "elite", title: "Elite Supplemental Training", tag: "Advanced", ids: ["gk-brian", "scoring", "attacking-1v1", "first-touch"] },
  },
  {
    id: "u13-u19", label: "U13–U19", sub: "Elite",
    featured: ["summer-camps", "omid"],
    supplemental: { kind: "elite", title: "Elite Supplemental Training", tag: "Advanced", ids: ["footskills", "futsal", "gk-brian", "scoring", "attacking-1v1", "first-touch"] },
  },
];

/* Player identities — an independent selector that filters the program grid
   by the kind of player, refining whatever age group is active. `programs`
   lists every program that fits that identity (intersected with the active
   age group at render time). */
const IDENTITIES = [
  {
    id: "getting-started",
    title: "Just Getting Started",
    tag: "Intro Soccer",
    range: "U3–U6",
    desc: "First touches, first games. Building coordination, confidence, and a love of the ball.",
    image: "assets/identity/getting-started.png",
    programs: ["little-boots", "summer-camps"],
  },
  {
    id: "developing",
    title: "Developing Player",
    tag: "Development",
    range: "U5–U12",
    desc: "Building the technical foundation and habits to step up into competitive play.",
    image: "assets/identity/developing.png",
    programs: ["summer-camps", "pre-travel", "omid", "footskills", "futsal", "first-touch"],
  },
  {
    id: "competitive",
    title: "Competitive Player",
    tag: "Travel Ready",
    range: "U7–U19",
    desc: "Sharpening the technical, tactical, and physical tools that win games at the travel level.",
    image: "assets/identity/competitive.png",
    programs: ["summer-camps", "pre-travel", "omid", "footskills", "futsal", "gk-brian", "scoring", "attacking-1v1", "first-touch"],
  },
  {
    id: "specialized",
    title: "Specialized Training",
    tag: "Position & Skill",
    range: "U7–U19",
    desc: "Position-specific and skill-specific clinics for players chasing the next level.",
    image: "assets/identity/specialized.png",
    programs: ["omid", "footskills", "futsal", "gk-brian", "scoring", "attacking-1v1", "first-touch"],
  },
];
