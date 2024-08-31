import getDbInstance from './dbSingleton.js'

// Install and load H3 extension
export default async () => {
  try {
    const db = await getDbInstance()
    await db.exec('INSTALL h3 FROM community;')
    await db.exec('LOAD h3;')
    console.log('H3 extension installed and loaded.')
  } catch (error) {
    console.error('Failed to install/load H3 extension:', error)
  }
}
