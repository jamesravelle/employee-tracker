const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function end(){
    connection.end();
}

function start(){
    inquirer
    .prompt({
      name: "start",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add", "View", "Update", "Exit"]
    })
    .then(function(answer) {
     switch (answer.start){
         case "Add":
            inquirer
            .prompt({
              name: "add",
              type: "list",
              message: "What would you like to add?",
              choices: ["Department", "Role", "Employee"]
            })
            .then(function(answer) {
                switch (answer.add){
                    case "Department":
                        inquirer
                        .prompt({
                            name: "addDept",
                            type: "input",
                            message: "What is the name of the department you are adding?"
                        }).then(function(answer){
                            connection.query(
                                `INSERT INTO department (name)
                                VALUES ("${answer.addDept}")`,
                                function(err) {
                                  if (err) throw err;
                                  console.log(answer.addDept + " was added.");
                                  start();
                                });
                        })
                        break;
                    case "Role":
                        let departmentArray = []
                        connection.query(`
                            SELECT *
                            FROM department;
                            `, function(err, results) {
                                if (err) throw err;
                                for(let i = 0; i < results.length; i++){
                                    departmentArray.push(results[i].name + " | " + results[i].id)
                                }
                        });
                        inquirer
                        .prompt(
                            [{
                                name: "title",
                                type: "input",
                                message: "What is the name of the role you are adding?"
                            },
                            {
                                name: "salary",
                                type: "input",
                                message: "What is the salary of the role?"
                            },
                            {
                                name: "department",
                                type: "list",
                                message: "What department is this in?",
                                choices: departmentArray
                            }]
                        ).then(function(answer){
                            let dept = answer.department.split(" | ");
                            connection.query(
                                `INSERT INTO role (title, salary, department_id)
                                VALUES ("${answer.title}", ${answer.salary}, ${parseInt(dept[1])})`,
                                function(err) {
                                  if (err) throw err;
                                  console.log(answer.title + " was added.");
                                  start();
                                });
                        })
                        break;
                    case "Employee":
                        let roles = []
                        connection.query(`
                            SELECT *
                            FROM role;
                            `, function(err, results) {
                                if (err) throw err;
                                for(let i = 0; i < results.length; i++){
                                    roles.push(results[i].title + " | " + results[i].id)
                                }
                        });
                        let manager = []
                        connection.query(`
                            SELECT *
                            FROM employee;
                            `, function(err, results) {
                                if (err) throw err;
                                for(let i = 0; i < results.length; i++){
                                    manager.push(`${results[i].first_name} ${results[i].last_name} | ${results[i].id}`)
                                }
                                manager.push("No Manager")
                        });
                        inquirer
                        .prompt(
                            [{
                                name: "firstname",
                                type: "input",
                                message: "What is the employee's first name?"
                            },
                            {
                                name: "lastname",
                                type: "input",
                                message: "What is the employee's last name?"
                            },
                            {
                                name: "role",
                                type: "list",
                                message: "What role do they have?",
                                choices: roles
                            },
                            {
                                name: "manager",
                                type: "list",
                                message: "Who is their manager?",
                                choices: manager
                            }]
                        ).then(function(answer){
                            let role = answer.role.split(" | ");
                            if(answer.manager === "No Manager"){
                                managerSelect = null;
                            } else{
                                let x = answer.manager.split(" | ");
                                managerSelect = parseInt(x[1]);
                            }
                            connection.query(
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES ("${answer.firstname}", "${answer.lastname}", ${parseInt(role[1])}, ${managerSelect})`,
                                function(err) {
                                  if (err) throw err;
                                  console.log(`${answer.firstname} ${answer.lastname} was added!`);
                                  start();
                                });
                        })
                        break;
                    default:
                        break;
                }
            });
             break;
        case "View":
            inquirer
            .prompt({
              name: "view",
              type: "list",
              message: "What would you like to view?",
              choices: ["Department", "Role", "Employee"]
            })
            .then(function(answer) {
                switch (answer.view){
                    case "Department":
                        connection.query(`
                            SELECT *
                            FROM department;
                            `, function(err, results) {
                                if (err) throw err;
                                console.log('\n--------- Departments ---------');
                                console.table(results);
                                console.log('-------------------------------\n\n\n');
                        });
                        start();
                        break;
                    case "Role":
                        connection.query(`
                            SELECT *
                            FROM role;
                            `, function(err, results) {
                                if (err) throw err;
                                console.log('\n ----------- Roles -----------');
                                console.table(results);
                                console.log('-----------------------------\n\n\n');
                        });
                        start();
                        break;
                    case "Employee":
                        connection.query(`
                            SELECT *
                            FROM employee;
                            `, function(err, results) {
                                if (err) throw err;
                                console.log('\n ---------- Employees ------------');
                                console.table(results);
                                console.log('---------------------------------\n\n\n');
                        });
                        start();
                        break;
                    default:
                        break;
                }
            });
            break;
        case "Update":
            let employeeArray = [];
            let roleArray = [];
            connection.query(`
                SELECT *
                FROM employee;
                `, function(err, results) {
                    if (err) throw err;
                    // console.table(results);
                    // Push all employees into an array
                    // newArray.push();
                    for(let i = 0; i < results.length; i++){
                        employeeArray.push(results[i].first_name + " " + results[i].last_name + " | " + results[i].id)
                    }
                    connection.query(`
                    SELECT *
                    FROM role;
                    `, function(err, results){
                        if (err) throw err;
                        for(let i = 0; i < results.length; i++){
                            roleArray.push(results[i].title + " | " + results[i].id)
                        }
                        // Run inquirer with employee and role arrays
                        inquirer
                        .prompt([
                            {
                            name: "update",
                            type: "list",
                            message: "Which employee would you like to update?",
                            choices: employeeArray
                            },
                            {
                            name: "newRole",
                            type: "list",
                            message: "What is their new role?",
                            choices: roleArray
                            }
                        ])
                        .then(function(answer) {
                            let employeeID = answer.update.split(' | ');
                            let roleID = answer.newRole.split(' | ');
                            // Run function with employee ID and the new role
                            updateEmployee(employeeID[1], roleID[1])
                            // console.log(`
                            // Employee: ${answer.update} / id: ${employeeID[1]}
                            // Role: ${answer.newRole} / id: ${roleID[1]}
                            // `)
                        });
                    })
                    
            })
            break;
        case "Exit":
            end();
            break;
        default:
            break;
     }
  });
}

function updateEmployee(employeeID,roleID){
    connection.query(`
    UPDATE employee 
    SET role_id = ${roleID} 
    WHERE id = ${employeeID}
                `, function(err, results) {
                    if (err) throw err;
                    console.log('Success!');
                    console.table(results);
                })
    end();
}
// end();