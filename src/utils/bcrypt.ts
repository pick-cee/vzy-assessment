import bcrypt from 'bcryptjs'

export async function passwordHash(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

export async function passwordCompare(password: string, hashPassword: string) {
    const isMatch = await bcrypt.compare(password, hashPassword)
    return isMatch
}

