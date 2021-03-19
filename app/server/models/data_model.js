class DataModel {
    constructor() {
        this.data = [];
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].id === id) {
                return this.data[i]
            }
        }
        return null
    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        }
        return false;
    }

    update(obj, id) {
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].id === id) {
                this.data[i] = Object.assign(this.data[i], obj);
                return true
            }
        }
        return false
    }

    delete(id) {     
        for(let i = 0; i < this.data.length; i++) {
            if(this.data[i].id === id) {
                this.data = this.data.filter(person => person.id !== id);
                return true
            }
        }
        return false
    }

    // this method will be overriden in the sub classes
    validate(obj) {
        return false;
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = DataModel;