import { PrismaClient, AgeBracket, Dimension, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const AGE_BRACKET_SETS: AgeBracket[][] = [
  [AgeBracket.COLLEGIAN, AgeBracket.LYCEEN],
  [AgeBracket.LYCEEN],
  [AgeBracket.LYCEEN, AgeBracket.UNIVERSITAIRE],
  [AgeBracket.UNIVERSITAIRE],
  [AgeBracket.UNIVERSITAIRE, AgeBracket.ADULTE],
  [AgeBracket.ADULTE],
  [AgeBracket.COLLEGIAN, AgeBracket.UNIVERSITAIRE],
  [AgeBracket.LYCEEN, AgeBracket.ADULTE],
  [AgeBracket.COLLEGIAN, AgeBracket.ADULTE],
];

const DIFFICULTY_PATTERN = [2, 3, 2, 4, 3, 1, 4, 5, 2, 3];

const DIMENSION_CONFIGS: Record<
  Dimension,
  {
    prefix: string;
    actions: string[];
    contexts: string[];
    motivations: string[];
    tags: string[][];
  }
> = {
  [Dimension.R]: {
    prefix: "Je me sens à ma place quand je",
    actions: [
      "répare des moteurs complexes",
      "mets en marche une machine industrielle",
      "assemble une structure métallique",
      "utilise des outils de précision",
      "réalise une installation électrique",
      "prépare un chantier de construction",
      "entretiens du matériel agricole",
      "contrôle la sécurité d'un site technique",
      "teste un équipement innovant",
      "effectue un travail manuel minutieux",
    ],
    contexts: [
      " dans un atelier bien équipé",
      " sur un chantier extérieur",
      " en plein air quelle que soit la météo",
      " avec une équipe technique soudée",
      " en autonomie sur le terrain",
      " au sein d'une entreprise artisanale",
    ],
    motivations: [
      "pour résoudre un problème très concret",
      "afin d'améliorer la fiabilité des installations",
      "pour voir immédiatement le résultat de mon travail",
      "afin d'aider mes collègues à avancer",
      "en respectant des consignes de sécurité strictes",
    ],
    tags: [
      ["manuel", "terrain", "fabrication"],
      ["precision", "outil", "atelier"],
      ["plein_air", "resilience"],
      ["construction", "equipe"],
      ["maintenance", "securite"],
    ],
  },
  [Dimension.I]: {
    prefix: "Je suis motivé lorsque je",
    actions: [
      "formule une hypothèse scientifique",
      "analyse des données complexes",
      "mets au point une expérience",
      "résous une équation difficile",
      "épluche des articles de recherche",
      "programme un prototype numérique",
      "compare différentes méthodes",
      "rédige un rapport d'analyse",
      "observe un phénomène étrange",
      "élabore un modèle théorique",
    ],
    contexts: [
      " dans un laboratoire moderne",
      " en bibliothèque spécialisée",
      " devant mon ordinateur",
      " avec d'autres passionnés de sciences",
      " lors d'un projet de recherche",
      " en travaillant sur des données ouvertes",
    ],
    motivations: [
      "pour comprendre le fond des choses",
      "afin de valider ou infirmer une intuition",
      "pour partager des découvertes solides",
      "afin de repousser les limites de la connaissance",
      "pour résoudre un problème issu du terrain",
    ],
    tags: [
      ["science", "analyse", "curiosite"],
      ["data", "innovation"],
      ["laboratoire", "experience"],
      ["programmation", "modelisation"],
      ["documentation", "rigueur"],
    ],
  },
  [Dimension.A]: {
    prefix: "Je m'épanouis quand je",
    actions: [
      "compose une mélodie originale",
      "dessine des croquis expressifs",
      "met en scène une performance",
      "imagine un univers visuel",
      "écris un texte poétique",
      "réalise une vidéo inspirante",
      "expérimente de nouvelles textures",
      "transforme un lieu par la décoration",
      "improvise avec d'autres artistes",
      "partage une œuvre personnelle",
    ],
    contexts: [
      " dans un atelier lumineux",
      " en résidence artistique",
      " sur scène devant un public",
      " au sein d'un collectif créatif",
      " dans un studio d'enregistrement",
      " en extérieur pour capter l'instant",
    ],
    motivations: [
      "pour exprimer librement mes idées",
      "afin de susciter une émotion",
      "pour transmettre un message engagé",
      "afin d'explorer de nouvelles formes",
      "pour donner vie à mon imaginaire",
    ],
    tags: [
      ["creation", "emotion", "expression"],
      ["scene", "collectif"],
      ["musique", "son"],
      ["design", "innovation"],
      ["ecriture", "storytelling"],
    ],
  },
  [Dimension.S]: {
    prefix: "Je me sens utile lorsque je",
    actions: [
      "écoute une personne en difficulté",
      "anime un atelier collectif",
      "accompagne un jeune dans son orientation",
      "transmets un savoir avec patience",
      "facilite un dialogue en tension",
      "organise une action solidaire",
      "co-construis un plan de progression",
      "soutiens une famille dans ses démarches",
      "motives un groupe pour un projet citoyen",
      "coordonne des bénévoles",
    ],
    contexts: [
      " au sein d'une association",
      " dans un établissement scolaire",
      " dans un centre de santé",
      " sur le terrain avec les habitants",
      " en visio avec des participants",
      " dans un espace de coworking inclusif",
    ],
    motivations: [
      "pour créer un climat de confiance",
      "afin de voir l'autre progresser",
      "pour faire émerger des idées ensemble",
      "afin de réduire les inégalités",
      "pour renforcer la cohésion du groupe",
    ],
    tags: [
      ["ecoute", "cooperation", "solidarite"],
      ["pedagogie", "accompagnement"],
      ["mediation", "conflit"],
      ["inclusion", "citoyennete"],
      ["benevolat", "coordination"],
    ],
  },
  [Dimension.E]: {
    prefix: "Je suis stimulé quand je",
    actions: [
      "porte une vision ambitieuse",
      "négocie avec des partenaires",
      "présente un projet devant un auditoire",
      "crée une stratégie commerciale",
      "développe un réseau d'alliés",
      "prends des décisions rapides",
      "identifie une opportunité de marché",
      "conduis une réunion exigeante",
      "pilote un plan d'action",
      "lance un produit innovant",
    ],
    contexts: [
      " dans une start-up dynamique",
      " au sein d'une grande entreprise",
      " lors d'un évènement professionnel",
      " avec des investisseurs",
      " en mentorant une équipe",
      " dans un incubateur entrepreneurial",
    ],
    motivations: [
      "pour obtenir des résultats mesurables",
      "afin de fédérer une équipe autour d'un objectif",
      "pour créer un impact visible",
      "afin de relever un défi ambitieux",
      "pour convaincre des interlocuteurs exigeants",
    ],
    tags: [
      ["leadership", "vision", "impact"],
      ["negociation", "strategie"],
      ["presentation", "communication"],
      ["reseau", "business"],
      ["innovation", "entrepreneuriat"],
    ],
  },
  [Dimension.C]: {
    prefix: "Je trouve ma stabilité lorsque je",
    actions: [
      "organise des dossiers complexes",
      "mets à jour des tableaux de suivi",
      "applique des procédures précises",
      "contrôle la conformité des données",
      "prépare un calendrier rigoureux",
      "classe des informations sensibles",
      "optimise un processus administratif",
      "assure le reporting d'une activité",
      "maintien un archivage impeccable",
      "rédige une note de synthèse",
    ],
    contexts: [
      " dans un bureau calme",
      " au sein d'une administration",
      " en soutien d'une équipe projet",
      " auprès d'un service financier",
      " dans un cabinet comptable",
      " à distance avec des outils collaboratifs",
    ],
    motivations: [
      "pour garantir la fiabilité des informations",
      "afin que chacun retrouve facilement les données",
      "pour sécuriser les décisions prises",
      "afin d'anticiper les imprévus",
      "pour respecter des normes strictes",
    ],
    tags: [
      ["organisation", "rigueur", "qualite"],
      ["process", "documentation"],
      ["comptabilite", "gestion"],
      ["archivage", "classement"],
      ["planification", "fiabilite"],
    ],
  },
};

function buildDimensionQuestions(dimension: Dimension): Prisma.QuestionCreateManyInput[] {
  const config = DIMENSION_CONFIGS[dimension];
  const entries: Prisma.QuestionCreateManyInput[] = [];

  let index = 0;

  outer: for (const action of config.actions) {
    for (const context of config.contexts) {
      for (const motivation of config.motivations) {
        const rawText = `${config.prefix} ${action}${context} ${motivation}.`;
        const text = rawText.replace(/\s+/g, " ").trim();
        const ageBrackets = AGE_BRACKET_SETS[index % AGE_BRACKET_SETS.length];
        const difficulty = DIFFICULTY_PATTERN[index % DIFFICULTY_PATTERN.length];
        const tags = config.tags[index % config.tags.length];

        entries.push({
          text,
          dimension,
          age_brackets: ageBrackets,
          version: 1,
          difficulty,
          tags,
        });

        index += 1;
        if (entries.length >= 60) {
          break outer;
        }
      }
    }
  }

  return entries;
}

const questions: Prisma.QuestionCreateManyInput[] = (
  Object.values(Dimension) as Dimension[]
).flatMap((dimension) => buildDimensionQuestions(dimension));

const occupations: Prisma.OccupationCreateManyInput[] = [
  {
    code: "R01",
    name: "Technicien de maintenance",
    description: "Entretien et reparation d'equipements industriels.",
    primaryDimension: Dimension.R,
    secondaryDimension: Dimension.C,
  },
  {
    code: "R02",
    name: "Mecanicien automobile",
    description: "Diagnostic et reparation de vehicules motorises.",
    primaryDimension: Dimension.R,
    secondaryDimension: Dimension.I,
  },
  {
    code: "R03",
    name: "Charpentier",
    description: "Construction et assemblage de structures en bois.",
    primaryDimension: Dimension.R,
    secondaryDimension: Dimension.A,
  },
  {
    code: "R04",
    name: "Technicien en genie civil",
    description: "Suivi de chantiers et controle de la qualite des ouvrages.",
    primaryDimension: Dimension.R,
    secondaryDimension: Dimension.C,
  },
  {
    code: "R05",
    name: "Agriculteur",
    description: "Gestion d'exploitations agricoles et entretien des cultures.",
    primaryDimension: Dimension.R,
    secondaryDimension: Dimension.S,
  },
  {
    code: "I01",
    name: "Chercheur scientifique",
    description: "Conception d'experiences et analyse de resultats.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.A,
  },
  {
    code: "I02",
    name: "Analyste de donnees",
    description: "Interpretation de donnees pour guider les decisions.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.C,
  },
  {
    code: "I03",
    name: "Ingenieur en recherche et developpement",
    description: "Innovation et conception de solutions techniques avancees.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.R,
  },
  {
    code: "I04",
    name: "Biologiste",
    description: "Etude des organismes vivants et de leur environnement.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.S,
  },
  {
    code: "I05",
    name: "Statisticien",
    description: "Modelisation mathematique et interpretation statistique.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.C,
  },
  {
    code: "A01",
    name: "Designer graphique",
    description: "Creation d'identites visuelles et supports graphiques.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.E,
  },
  {
    code: "A02",
    name: "Architecte",
    description: "Conception de batiments esthetiques et fonctionnels.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.R,
  },
  {
    code: "A03",
    name: "Musicien compositeur",
    description: "Creation d'oeuvres musicales et collaborations artistiques.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.S,
  },
  {
    code: "A04",
    name: "Redacteur creatif",
    description: "Ecriture de contenus originaux pour divers publics.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.E,
  },
  {
    code: "A05",
    name: "Styliste de mode",
    description: "Conception de collections vestimentaires et tendances.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.E,
  },
  {
    code: "S01",
    name: "Conseiller d'orientation",
    description: "Accompagnement individuel dans les choix professionnels.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.I,
  },
  {
    code: "S02",
    name: "Enseignant",
    description: "Transmission de savoirs et animation de groupes d'apprenants.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.E,
  },
  {
    code: "S03",
    name: "Infirmier",
    description: "Soins aux patients et coordination avec l'equipe medicale.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.C,
  },
  {
    code: "S04",
    name: "Travailleur social",
    description: "Soutien aux personnes en situation de vulnerabilite.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.E,
  },
  {
    code: "S05",
    name: "Coach professionnel",
    description: "Accompagnement des individus dans leur developpement de carriere.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.E,
  },
  {
    code: "E01",
    name: "Chef de projet",
    description: "Planification et pilotage d'equipes pluridisciplinaires.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.C,
  },
  {
    code: "E02",
    name: "Entrepreneur",
    description: "Creation et developpement d'activites economiques.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.I,
  },
  {
    code: "E03",
    name: "Responsable commercial",
    description: "Conduite d'equipes de vente et negociation strategique.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.S,
  },
  {
    code: "E04",
    name: "Directeur marketing",
    description: "Definition de strategies pour promouvoir produits et services.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.A,
  },
  {
    code: "E05",
    name: "Consultant en management",
    description: "Conseil strategique aupres de directions d'entreprise.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.I,
  },
  {
    code: "C01",
    name: "Comptable",
    description: "Tenue des comptes et preparation des etats financiers.",
    primaryDimension: Dimension.C,
    secondaryDimension: Dimension.E,
  },
  {
    code: "C02",
    name: "Gestionnaire administratif",
    description: "Organisation des dossiers et suivi des procedures internes.",
    primaryDimension: Dimension.C,
    secondaryDimension: Dimension.S,
  },
  {
    code: "C03",
    name: "Assistant juridique",
    description: "Preparation de documents legaux et veille reglementaire.",
    primaryDimension: Dimension.C,
    secondaryDimension: Dimension.I,
  },
  {
    code: "C04",
    name: "Archiviste",
    description: "Classement et conservation d'informations sensibles.",
    primaryDimension: Dimension.C,
    secondaryDimension: Dimension.S,
  },
  {
    code: "C05",
    name: "Planificateur logistique",
    description: "Coordination des flux de marchandises et optimisation des stocks.",
    primaryDimension: Dimension.C,
    secondaryDimension: Dimension.E,
  },
];

async function main() {
  await prisma.question.deleteMany();
  await prisma.occupation.deleteMany();

  await prisma.question.createMany({ data: questions, skipDuplicates: true });
  await prisma.occupation.createMany({ data: occupations, skipDuplicates: true });
}

main()
  .then(() => {
    console.log("Base RIASEC initialisee avec succes.");
  })
  .catch((error) => {
    console.error("Echec de l'initialisation RIASEC :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
