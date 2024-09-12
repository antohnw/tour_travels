const db = require('../db');

function Customer({ customer_id = null, customer_name, email, phone, signup_date, preferred_contact_method, created_by }) {
    this.customer_id = customer_id;
    this.customer_name = customer_name;
    this.email = email;
    this.phone = phone;
    this.signup_date = signup_date || new Date();
    this.preferred_contact_method = preferred_contact_method;
    this.created_by = created_by;
};
//Create customer method

Customer.prototype.createCustomer = async function () {
    try {
        const result = await db.query(
            `INSERT INTO customers(customer_name, email, phone, signup_date, preferred_contact_method, created_by)
            VALUES($1,$2,$3,$4,$5, $6) RETURNING customer_id`,
            [this.customer_name, this.email, this.phone, this.signup_date, this.preferred_contact_method, this.created_by]);
        this.customer_id = result.rows[0].customer_id;
        return this
    } catch (error) {
        throw error;
    }
}

//Find All customers
Customer.findAllCustomers = async function () {
    try {
        const result = await db.query(`SELECT * FROM customers`);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = Customer;