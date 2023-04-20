// Define modules
const mysql = require("mysql");
const dotenv = require("dotenv");
const moment = require("moment");

// Define credentials
dotenv.config({ path: "./config.env" });

//Define conection
const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.NAME_DB,
});

exports.test = () => {
    // Define connection test
    con.getConnection((err) => {
        if (err) {
            console.log(moment().format(), "Connect Error!😵");
        } else {
            console.log(moment().format(), "Connected!😎");
        };
    });
};

exports.whereObj = (filter) => {
    // run query
    return new Promise((resolve, reject) => {
        let where = "";
        for (let w of filter) {
            if (w.value && w.value[w.nameValue] !== "" && w.value != "") {
                where += where == "" ? "where " : "and ";
                where += w.parent && w.parent != "" ? w.parent + "." : "";
                if (w.id) {
                    where += w.id + "=" + w.value[w.nameValue] + " ";
                } else if (w.name == "from" && w.type == "date") {
                    where += "datetime between'" + w.value + "'";
                } else if (w.name == "to" && w.type == "date") {
                    where += "'" + moment(w.value).add(1, 'd').format("YYYY-MM-DD") + "'";
                } else if (w.type == "null") {
                    where += w.name + " is " + w.value + " ";
                } else if (w.searchFields && w.searchFields.length) {
                    let values = "(";
                    for (let name of w.searchFields) {
                        values += values == "(" ? name + " like'%" + w.value + "%'" : "or " + name + " like'%" + w.value + "%'";
                    }
                    where += values + ")";
                } else {
                    where += w.name + " like'%" + w.value + "%'";
                }
            }
        }
        return resolve(where);
    });
};

exports.run_query = (req, res, session, query) => {
    // run query
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            return resolve();
        });
    });
};

exports.get_data = (req, res, session, query) => {
    // get data
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            return resolve(data);
        });
    });
};

exports.get_row = (req, res, session, query) => {
    // get row
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            if (data.length == 0) {
                console.log(moment().format(), session, "not found row | query: " + query);
                return res.status(200).send({ status: "not found" });
            };
            return resolve(data[0]);
        });
    });
};

exports.get_id = (req, res, session, query) => {
    // get row id
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            console.log(moment().format(), session, "Inserted ID: " + data.insertId);
            return resolve(data.insertId);
        });
    });
};

exports.get_value = (req, res, session, query) => {
    // get value
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            if (data.length == 0) {
                console.log(moment().format(), session, "invalid row | query: " + query);
                return res.status(200).send({ status: "invalid" });
            };
            return resolve(data[0].value || 0);
        });
    });
};

exports.empty_row = (req, res, session, query) => {
    // empty row
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            if (data.length > 0) {
                console.log(moment().format(), session, "duplicate row | query: " + query);
                return res.status(200).send({ status: "duplicate" });
            };
            return resolve(data[0]);
        });
    });
};

exports.exists_row = (req, res, session, query) => {
    // exists row
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            if (data.length == 0) {
                console.log(moment().format(), session, "invalid row | query: " + query);
                return res.status(200).send({ status: "invalid" });
            };
            return resolve(data[0]);
        });
    });
};

exports.valid_row = (req, res, session, query) => {
    // valid row
    return new Promise((resolve, reject) => {
        con.query(query, (err, data) => {
            console.log(moment().format(), session, query);
            if (err) {
                if (err.sqlMessage) {
                    console.error(moment().format(), session, err.sqlMessage, err.sql);
                } else {
                    console.error(moment().format(), session, err);
                }
                return res.status(500).send({ status: "query error" });
            };
            if (data.length == 0) {
                return resolve(false);
            };
            return resolve(true);
        });
    });
};
