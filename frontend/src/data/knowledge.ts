export interface KnowledgePoint {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  hasSimulation: boolean
  keywords: string[]
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  knowledgePoints: KnowledgePoint[]
}

const required1: Category = {
  id: 'required1',
  name: 'Chemical Substances',
  description: 'Required 1: Classification and reactions',
  icon: 'atom',
  subcategories: [
    {
      id: 'matter-classification',
      name: 'Matter Classification',
      knowledgePoints: [
        { id: 'matter-types', title: 'Matter Types', description: 'Pure substances and mixtures', category: 'required1', subcategory: 'matter-classification', hasSimulation: true, keywords: ['pure', 'mixture'] },
        { id: 'dispersion-system', title: 'Dispersion Systems', description: 'Solutions colloids suspensions', category: 'required1', subcategory: 'matter-classification', hasSimulation: true, keywords: ['colloid', 'solution'] }
      ]
    },
    {
      id: 'chemical-reaction',
      name: 'Chemical Reactions',
      knowledgePoints: [
        { id: 'ionic-reaction', title: 'Ionic Reactions', description: 'Electrolytes and ionic equations', category: 'required1', subcategory: 'chemical-reaction', hasSimulation: true, keywords: ['ionic', 'electrolyte'] },
        { id: 'redox-reaction', title: 'Redox Reactions', description: 'Oxidation and reduction', category: 'required1', subcategory: 'chemical-reaction', hasSimulation: true, keywords: ['redox', 'oxidation'] }
      ]
    }
  ]
}

const required2: Category = {
  id: 'required2',
  name: 'Chemical Reactions and Energy',
  description: 'Required 2: Energy changes and chemical bonds',
  icon: 'zap',
  subcategories: [
    {
      id: 'atomic-structure',
      name: 'Atomic Structure',
      knowledgePoints: [
        { id: 'atom-structure', title: 'Atom Structure', description: 'Electron configuration', category: 'required2', subcategory: 'atomic-structure', hasSimulation: true, keywords: ['atom', 'electron'] },
        { id: 'periodic-table', title: 'Periodic Table', description: 'Periods and groups', category: 'required2', subcategory: 'atomic-structure', hasSimulation: true, keywords: ['periodic', 'element'] },
        { id: 'periodic-law', title: 'Periodic Law', description: 'Periodic trends', category: 'required2', subcategory: 'atomic-structure', hasSimulation: true, keywords: ['trend', 'radius'] }
      ]
    },
    {
      id: 'chemical-bond',
      name: 'Chemical Bonds',
      knowledgePoints: [
        { id: 'ionic-bond', title: 'Ionic Bond', description: 'Formation of ionic bonds', category: 'required2', subcategory: 'chemical-bond', hasSimulation: true, keywords: ['ionic', 'bond'] },
        { id: 'covalent-bond', title: 'Covalent Bond', description: 'Shared electron pairs', category: 'required2', subcategory: 'chemical-bond', hasSimulation: true, keywords: ['covalent', 'sharing'] },
        { id: 'metallic-bond', title: 'Metallic Bond', description: 'Sea of electrons', category: 'required2', subcategory: 'chemical-bond', hasSimulation: true, keywords: ['metallic', 'electron'] }
      ]
    },
    {
      id: 'electrochemistry',
      name: 'Electrochemistry',
      knowledgePoints: [
        { id: 'galvanic-cell', title: 'Galvanic Cell', description: 'Chemical to electrical energy', category: 'required2', subcategory: 'electrochemistry', hasSimulation: true, keywords: ['galvanic', 'battery'] },
        { id: 'electrolysis', title: 'Electrolysis', description: 'Electrical to chemical energy', category: 'required2', subcategory: 'electrochemistry', hasSimulation: true, keywords: ['electrolysis', 'electrode'] }
      ]
    },
    {
      id: 'reaction-rate',
      name: 'Reaction Rate and Equilibrium',
      knowledgePoints: [
        { id: 'reaction-rate-factors', title: 'Reaction Rate', description: 'Factors affecting rate', category: 'required2', subcategory: 'reaction-rate', hasSimulation: true, keywords: ['rate', 'catalyst'] },
        { id: 'chemical-equilibrium', title: 'Chemical Equilibrium', description: 'Dynamic equilibrium', category: 'required2', subcategory: 'reaction-rate', hasSimulation: true, keywords: ['equilibrium', 'constant'] }
      ]
    }
  ]
}

const elective1: Category = {
  id: 'elective1',
  name: 'Chemical Reaction Principles',
  description: 'Elective: Advanced reaction principles',
  icon: 'flask',
  subcategories: [
    {
      id: 'solution-equilibrium',
      name: 'Solution Equilibrium',
      knowledgePoints: [
        { id: 'water-ionization', title: 'Water Ionization', description: 'pH and ion product', category: 'elective1', subcategory: 'solution-equilibrium', hasSimulation: true, keywords: ['pH', 'ionization'] },
        { id: 'titration', title: 'Acid-Base Titration', description: 'Titration curves', category: 'elective1', subcategory: 'solution-equilibrium', hasSimulation: true, keywords: ['titration', 'indicator'] }
      ]
    }
  ]
}

const elective2: Category = {
  id: 'elective2',
  name: 'Organic Chemistry',
  description: 'Elective: Organic compounds',
  icon: 'hexagon',
  subcategories: [
    {
      id: 'hydrocarbon',
      name: 'Hydrocarbons',
      knowledgePoints: [
        { id: 'alkane', title: 'Alkanes', description: 'Saturated hydrocarbons', category: 'elective2', subcategory: 'hydrocarbon', hasSimulation: true, keywords: ['alkane', 'methane'] },
        { id: 'alkene', title: 'Alkenes', description: 'Double bonds', category: 'elective2', subcategory: 'hydrocarbon', hasSimulation: true, keywords: ['alkene', 'ethene'] },
        { id: 'benzene', title: 'Benzene', description: 'Aromatic compounds', category: 'elective2', subcategory: 'hydrocarbon', hasSimulation: true, keywords: ['benzene', 'aromatic'] }
      ]
    }
  ]
}

const elective3: Category = {
  id: 'elective3',
  name: 'Structure and Properties',
  description: 'Elective: Molecular structure',
  icon: 'orbit',
  subcategories: [
    {
      id: 'molecular-structure',
      name: 'Molecular Structure',
      knowledgePoints: [
        { id: 'vsepr', title: 'VSEPR Theory', description: 'Molecular geometry', category: 'elective3', subcategory: 'molecular-structure', hasSimulation: true, keywords: ['VSEPR', 'geometry'] },
        { id: 'hybridization', title: 'Hybridization', description: 'Orbital hybridization', category: 'elective3', subcategory: 'molecular-structure', hasSimulation: true, keywords: ['sp', 'hybrid'] }
      ]
    }
  ]
}

export const categories: Category[] = [required1, required2, elective1, elective2, elective3]

export const getAllKnowledgePoints = (): KnowledgePoint[] => {
  const points: KnowledgePoint[] = []
  categories.forEach(cat => {
    cat.subcategories.forEach(sub => {
      points.push(...sub.knowledgePoints)
    })
  })
  return points
}

export const getKnowledgePointById = (id: string): KnowledgePoint | undefined => {
  return getAllKnowledgePoints().find(p => p.id === id)
}

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(c => c.id === id)
}

export const searchKnowledgePoints = (query: string): KnowledgePoint[] => {
  const lowerQuery = query.toLowerCase()
  return getAllKnowledgePoints().filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  )
}
