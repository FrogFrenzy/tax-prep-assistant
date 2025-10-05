// Generate a secure NEXTAUTH_SECRET
const crypto = require('crypto')

const secret = crypto.randomBytes(32).toString('base64')
console.log('Generated NEXTAUTH_SECRET:')
console.log(secret)
console.log('\nAdd this to your .env.local and Vercel environment variables:')