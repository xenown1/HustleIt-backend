const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'HustleIt backend is running!' })
})

// Temporary "database" (just an array for now)
const users = []

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'User already exists' })
    }
    
    // Hash the password!
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword  // ✅ Stored hashed!
    }
    
    users.push(newUser)
    res.json({ message: 'User registered!', user: { id: newUser.id, username } })
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body
    
    const user = users.find(u => u.username === username)
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Compare hashed password
    const isValid = await bcrypt.compare(password, user.password)
    
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    res.json({ 
        message: 'Login successful!',
        user: { id: user.id, username: user.username }
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

