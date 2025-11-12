import { PrismaClient, Dimension, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const ageBrackets = ["15-18", "19-25", "26-35", "36+"];

const questions: Prisma.QuestionCreateManyInput[] = [
  {
    text: "Je prends plaisir à réparer des objets mécaniques.",
    dimension: Dimension.R,
    ageBrackets,
    version: 1,
  },
  {
    text: "J'aime travailler avec des outils et des machines.",
    dimension: Dimension.R,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je préfère les tâches pratiques et concrètes.",
    dimension: Dimension.R,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis à l'aise à l'extérieur et dans les ateliers.",
    dimension: Dimension.R,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je me sens satisfait quand je construis quelque chose de mes mains.",
    dimension: Dimension.R,
    ageBrackets,
    version: 1,
  },
  {
    text: "J'apprécie analyser des données pour comprendre un phénomène.",
    dimension: Dimension.I,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis motivé par la résolution de problèmes complexes.",
    dimension: Dimension.I,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je préfère baser mes décisions sur des preuves et des faits.",
    dimension: Dimension.I,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je prends plaisir à expérimenter pour vérifier une hypothèse.",
    dimension: Dimension.I,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis curieux d'explorer comment les choses fonctionnent.",
    dimension: Dimension.I,
    ageBrackets,
    version: 1,
  },
  {
    text: "Créer des œuvres originales me procure de la joie.",
    dimension: Dimension.A,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je préfère les activités qui me laissent une grande liberté d'expression.",
    dimension: Dimension.A,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis inspiré par la beauté visuelle ou sonore.",
    dimension: Dimension.A,
    ageBrackets,
    version: 1,
  },
  {
    text: "J'aime imaginer des solutions originales.",
    dimension: Dimension.A,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je me sens vivant lorsque j'innove ou que je crée.",
    dimension: Dimension.A,
    ageBrackets,
    version: 1,
  },
  {
    text: "Aider les autres me donne un sentiment d'accomplissement.",
    dimension: Dimension.S,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je sais écouter et comprendre les besoins des autres.",
    dimension: Dimension.S,
    ageBrackets,
    version: 1,
  },
  {
    text: "J'aime transmettre mes connaissances et accompagner l'apprentissage.",
    dimension: Dimension.S,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis à l'aise dans les environnements collaboratifs.",
    dimension: Dimension.S,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis motivé par l'amélioration du bien-être collectif.",
    dimension: Dimension.S,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je me sens à ma place lorsque je dirige une équipe.",
    dimension: Dimension.E,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je prends des décisions rapidement face à l'incertitude.",
    dimension: Dimension.E,
    ageBrackets,
    version: 1,
  },
  {
    text: "Fixer des objectifs ambitieux me stimule.",
    dimension: Dimension.E,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis à l'aise pour convaincre et négocier.",
    dimension: Dimension.E,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je cherche des situations où je peux influencer les résultats.",
    dimension: Dimension.E,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis satisfait quand tout est classé et conforme.",
    dimension: Dimension.C,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je préfère suivre des procédures clairement établies.",
    dimension: Dimension.C,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je prête attention aux détails et aux règles.",
    dimension: Dimension.C,
    ageBrackets,
    version: 1,
  },
  {
    text: "Tenir des registres précis me semble naturel.",
    dimension: Dimension.C,
    ageBrackets,
    version: 1,
  },
  {
    text: "Je suis efficace dans les tâches répétitives mais essentielles.",
    dimension: Dimension.C,
    ageBrackets,
    version: 1,
  },
];

const occupations: Prisma.OccupationCreateManyInput[] = [
  {
    code: "R01",
    name: "Technicien de maintenance",
    description: "Entretien et réparation d'équipements industriels.",
    primaryDimension: Dimension.R,
    secondaryDimension: Dimension.C,
  },
  {
    code: "R02",
    name: "Mécanicien automobile",
    description: "Diagnostic et réparation de véhicules motorisés.",
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
    name: "Technicien en génie civil",
    description: "Suivi de chantiers et contrôle de la qualité des ouvrages.",
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
    description: "Conception d'expériences et analyse de résultats.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.A,
  },
  {
    code: "I02",
    name: "Analyste de données",
    description: "Interprétation de données pour guider les décisions.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.C,
  },
  {
    code: "I03",
    name: "Ingénieur en recherche et développement",
    description: "Innovation et conception de solutions techniques avancées.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.R,
  },
  {
    code: "I04",
    name: "Biologiste",
    description: "Étude des organismes vivants et de leur environnement.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.S,
  },
  {
    code: "I05",
    name: "Statisticien",
    description: "Modélisation mathématique et interprétation statistique.",
    primaryDimension: Dimension.I,
    secondaryDimension: Dimension.C,
  },
  {
    code: "A01",
    name: "Designer graphique",
    description: "Création d'identités visuelles et supports graphiques.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.E,
  },
  {
    code: "A02",
    name: "Architecte",
    description: "Conception de bâtiments esthétiques et fonctionnels.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.R,
  },
  {
    code: "A03",
    name: "Musicien compositeur",
    description: "Création d'œuvres musicales et collaborations artistiques.",
    primaryDimension: Dimension.A,
    secondaryDimension: Dimension.S,
  },
  {
    code: "A04",
    name: "Rédacteur créatif",
    description: "Écriture de contenus originaux pour divers publics.",
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
    description: "Soins aux patients et coordination avec l'équipe médicale.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.C,
  },
  {
    code: "S04",
    name: "Travailleur social",
    description: "Soutien aux personnes en situation de vulnérabilité.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.E,
  },
  {
    code: "S05",
    name: "Coach professionnel",
    description: "Accompagnement des individus dans leur développement de carrière.",
    primaryDimension: Dimension.S,
    secondaryDimension: Dimension.E,
  },
  {
    code: "E01",
    name: "Chef de projet",
    description: "Planification et pilotage d'équipes pluridisciplinaires.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.C,
  },
  {
    code: "E02",
    name: "Entrepreneur",
    description: "Création et développement d'activités économiques.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.I,
  },
  {
    code: "E03",
    name: "Responsable commercial",
    description: "Conduite d'équipes de vente et négociation stratégique.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.S,
  },
  {
    code: "E04",
    name: "Directeur marketing",
    description: "Définition de stratégies pour promouvoir produits et services.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.A,
  },
  {
    code: "E05",
    name: "Consultant en management",
    description: "Conseil stratégique auprès de directions d'entreprise.",
    primaryDimension: Dimension.E,
    secondaryDimension: Dimension.I,
  },
  {
    code: "C01",
    name: "Comptable",
    description: "Tenue des comptes et préparation des états financiers.",
    primaryDimension: Dimension.C,
    secondaryDimension: Dimension.E,
  },
  {
    code: "C02",
    name: "Gestionnaire administratif",
    description: "Organisation des dossiers et suivi des procédures internes.",
    primaryDimension: Dimension.C,
    secondaryDimension: Dimension.S,
  },
  {
    code: "C03",
    name: "Assistant juridique",
    description: "Préparation de documents légaux et veille réglementaire.",
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
  await prisma.question.createMany({ data: questions, skipDuplicates: true });
  await prisma.occupation.createMany({ data: occupations, skipDuplicates: true });
}

main()
  .then(() => {
    console.log("Base RIASEC initialisée avec succès.");
  })
  .catch((error) => {
    console.error("Échec de l'initialisation RIASEC :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
