const fs = require("fs")
const data = require("../data.json")
const { grade, date } = require("../utils")

// Page INDEX
exports.index = (req, res) => {
    const students = []

    data.students.forEach(element => {
        students.push({
            ...element,
            select: grade(element.select)
        })
    })

    return res.render("students/index", { students })
}

// Page CREATE
exports.create = (req, res) => {
    return res.render("students/create")
}

// Dados do Formulário de criação
exports.post = (req, res) => {
    const keys = Object.keys(req.body)

    for(let key of keys) {
        if(req.body[key] == "") {
            return res.send("Please, fill all fields!")
        }
    }

    let { birth } = req.body

    birth = Date.parse(req.body.birth)
    let id = 1
    const lastStudent = data.students[data.students.length - 1]

    if(lastStudent) id = lastStudent + 1

    data.students.push({
        id,
        ...req.body,
        birth
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
            return res.send("Write file error!")
        }

        return res.redirect("/students")
    })
}

// Page dos professores
exports.show = (req, res) => {
    const { id } = req.params

    let foundStudents = data.students.find((student) => {
        return student.id == id
    })

    if(!foundStudents) return res.send("Student not found!")

    const student = {
        ...foundStudents,
        birth: date(foundStudents.birth).birthDay,
        select: grade(foundStudents.select)
    }

    return res.render("students/show", { student })
}

// Page do formulário de edição
exports.edit = (req, res) => {
    const { id } =  req.params

    const foundStudent = data.students.find((student) => {
        return student.id == id
    })

    if(!foundStudent) return res.send("Student not found!")

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }

    return res.render("students/edit", { student })
}

// Dados do formulário de edição
exports.put = (req, res) => {
    const { id } = req.body
    let index = 0

    const foundStudents = data.students.find((student, foundIndex) => {
        if (student.id == id) {
            index = foundIndex
            return true
        }
    })

    if (!foundStudents) return res.send("Student not found!")

    const student = {
        ...foundStudents,
        ...req.body,
        id: Number(req.body.id),
        birth: Date.parse(req.body.birth)
    }

    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send("Write file error!")

        return res.redirect(`/students/${id}`)
    })
}

// Apaga dado do database
exports.delete = (req, res) => {
    const { id } = req.body

    const filteredStudents = data.students.filter((student) => {
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send("Write file error!")

        return res.redirect("/students")
    })
}