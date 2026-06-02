/**
 * Curated catalog of car makes and models common in the UAE used-car market.
 * Models are the brand-name nameplates a UAE buyer is most likely to type in,
 * not an exhaustive list. Buyers whose model isn't here can free-type via the
 * "Other" option in the model dropdown.
 */

export type CarMake = {
  name: string
  models: readonly string[]
}

export const CAR_MAKES: readonly CarMake[] = [
  {
    name: 'Toyota',
    models: ['Land Cruiser', 'Prado', 'Fortuner', 'Hilux', 'Camry', 'Corolla', 'RAV4', 'Highlander', 'Yaris', 'Rush', 'Avalon', 'C-HR', 'Innova'],
  },
  {
    name: 'Nissan',
    models: ['Patrol', 'X-Trail', 'Pathfinder', 'Sunny', 'Altima', 'Maxima', 'Sentra', 'Kicks', 'Armada', 'Navara', 'Murano', 'Juke'],
  },
  {
    name: 'Honda',
    models: ['Accord', 'Civic', 'CR-V', 'Pilot', 'HR-V', 'City', 'Odyssey', 'Passport'],
  },
  {
    name: 'Mitsubishi',
    models: ['Pajero', 'Outlander', 'ASX', 'Lancer', 'L200', 'Eclipse Cross', 'Attrage', 'Xpander'],
  },
  {
    name: 'Hyundai',
    models: ['Tucson', 'Santa Fe', 'Elantra', 'Accent', 'Sonata', 'Creta', 'Palisade', 'Kona', 'Azera', 'Veloster', 'Staria'],
  },
  {
    name: 'Kia',
    models: ['Sportage', 'Sorento', 'Cerato', 'Picanto', 'Rio', 'Carnival', 'Telluride', 'Seltos', 'K5', 'Pegas'],
  },
  {
    name: 'Mazda',
    models: ['CX-5', 'CX-9', 'CX-30', 'Mazda3', 'Mazda6', 'MX-5', 'CX-50'],
  },
  {
    name: 'Lexus',
    models: ['LX 570', 'LX 600', 'GX 460', 'RX 350', 'NX 300', 'ES 350', 'IS 350', 'LS 500', 'LC 500', 'UX 200'],
  },
  {
    name: 'Infiniti',
    models: ['QX80', 'QX60', 'QX50', 'QX55', 'Q50', 'Q70', 'QX30'],
  },
  {
    name: 'Mercedes-Benz',
    models: ['G-Class', 'GLE', 'GLS', 'GLC', 'GLA', 'GLB', 'C-Class', 'E-Class', 'S-Class', 'A-Class', 'CLA', 'CLS', 'EQS', 'EQE', 'AMG GT', 'V-Class'],
  },
  {
    name: 'BMW',
    models: ['X1', 'X3', 'X4', 'X5', 'X6', 'X7', '3 Series', '5 Series', '7 Series', '2 Series', '4 Series', '8 Series', 'M3', 'M4', 'M5', 'iX', 'i4'],
  },
  {
    name: 'Audi',
    models: ['Q3', 'Q5', 'Q7', 'Q8', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'RS6', 'R8', 'e-tron'],
  },
  {
    name: 'Porsche',
    models: ['Cayenne', 'Macan', 'Panamera', '911', 'Taycan', '718 Cayman', '718 Boxster'],
  },
  {
    name: 'Land Rover',
    models: ['Range Rover', 'Range Rover Sport', 'Range Rover Velar', 'Range Rover Evoque', 'Discovery', 'Discovery Sport', 'Defender'],
  },
  {
    name: 'Volkswagen',
    models: ['Tiguan', 'Touareg', 'Passat', 'Golf', 'Polo', 'Jetta', 'Atlas', 'ID.4'],
  },
  {
    name: 'Ford',
    models: ['F-150', 'Explorer', 'Edge', 'Expedition', 'Mustang', 'EcoSport', 'Ranger', 'Bronco', 'Taurus', 'Escape', 'Territory'],
  },
  {
    name: 'Chevrolet',
    models: ['Tahoe', 'Suburban', 'Traverse', 'Trailblazer', 'Captiva', 'Malibu', 'Camaro', 'Corvette', 'Silverado', 'Spark', 'Groove'],
  },
  {
    name: 'GMC',
    models: ['Yukon', 'Yukon XL', 'Acadia', 'Terrain', 'Sierra', 'Hummer EV'],
  },
  {
    name: 'Jeep',
    models: ['Grand Cherokee', 'Wrangler', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer'],
  },
  {
    name: 'Dodge',
    models: ['Charger', 'Challenger', 'Durango', 'RAM 1500', 'RAM 2500'],
  },
  {
    name: 'Tesla',
    models: ['Model 3', 'Model Y', 'Model S', 'Model X', 'Cybertruck'],
  },
  {
    name: 'MINI',
    models: ['Cooper', 'Cooper S', 'Countryman', 'Clubman', 'JCW'],
  },
  {
    name: 'Volvo',
    models: ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'V60', 'V90'],
  },
  {
    name: 'Subaru',
    models: ['Forester', 'Outback', 'XV', 'Impreza', 'Legacy', 'BRZ'],
  },
  {
    name: 'Cadillac',
    models: ['Escalade', 'XT4', 'XT5', 'XT6', 'CT5', 'CT4', 'Lyriq'],
  },
] as const

export const MAKE_NAMES: readonly string[] = CAR_MAKES.map((m) => m.name)

export function modelsForMake(makeName: string): readonly string[] {
  return CAR_MAKES.find((m) => m.name === makeName)?.models ?? []
}

const CURRENT_YEAR = new Date().getFullYear()

/** Years offered in the booking form. Descending — newest first. Goes back 30 years. */
export const CAR_YEARS: readonly number[] = Array.from(
  { length: CURRENT_YEAR - 1995 + 1 },
  (_, i) => CURRENT_YEAR - i,
)
