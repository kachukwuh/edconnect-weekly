const DataModel = require('./data_model');

class User {
    constructor(id, firstname, lastname, email, password, matricNumber, program, graduationYear) {
        this.id = id,
        this.firstname = firstname,
        this.lastname = lastname,
        this.email = email,
        this.password = password,
        this.matricNumber = matricNumber,
        this.program = program,
        this.graduationYear = graduationYear

    }

    getFullName() {
        return `${this.firstname} ${this.lastname}`
    }
}

class Users extends DataModel {
    authenticate(email, password) {
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].email === email && this.data[i].password === password) {
                return true
            }
        }
        return false
    }

    getByEmail(email) {
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].email === email) {
                return this.data[i]
            }
        }
        return null
    }

    getByMatricNumber(matricNumber) {
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].matricNumber === matricNumber) {
                return this.data[i]
            }
        }
        return null
    }

    validate(obj) {
        for(let key in obj) {
            if(obj[key] === '') {
                return false
            }
        }

        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].email === obj.email || this.data[i].matricNumber === obj.matricNumber || obj.password.length < 7) {
                return false
            }
        }
        return true
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
};