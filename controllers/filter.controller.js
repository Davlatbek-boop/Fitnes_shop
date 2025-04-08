const pool = require("../config/postgress");
const { errorHandler } = require("../helpers/error_handler");

const getProductsByDate = async (req, res) => {
  try {
    const { start_date, end_date } = req.body;
    const products = await pool.query(
      `
    SELECT p.name, p.description, p.quantity, p.condition, p.image_url, p.is_active FROM products AS p
    LEFT JOIN contracts AS c ON p.id = c."productId"
    LEFT JOIN statuses AS s ON c."statusId" = s.id
    WHERE s.name = 'approved' AND s."updatedAt"
    BETWEEN $1 AND $2;

        `,
      [start_date, end_date]
    );
    res.status(200).send({ products: products.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClientsByDemages = async (req, res) => {
  try {
    const { productName, fromDate, toDate } = req.body;

    const result = await pool.query(
      `
      SELECT cl.user_name, cl.last_name, cl.email, cl.phone, cl.address
      FROM clients AS cl
      JOIN contracts AS c ON cl.id = c."clientId"
      JOIN products AS p ON c."productId" = p.id
      JOIN statuses AS s ON c."statusId" = s.id
      WHERE s.name = 'damaged'
        AND p.name = $1
        AND s."updatedAt" BETWEEN $2 AND $3
    `,
      [productName, fromDate, toDate]
    );

    res.status(200).send({ result: result.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClientsByRejected = async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;
    const result = await pool.query(
      `
      SELECT cl.user_name, cl.last_name, cl.email, cl.phone, cl.address
      FROM clients AS cl
      JOIN contracts AS c ON cl.id = c."clientId"
      JOIN statuses AS s ON c."statusId" = s.id
      WHERE s.name = 'rejected'
      AND s."updatedAt" BETWEEN $1 AND $2;
    `,
      [fromDate, toDate]
    );
    res.status(200).send({ result: result.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const countBestOwners = async (req, res) => {
  try {
    const { category } = req.body;
    const result = await pool.query(
      `
      select o.id, o.user_name, o.email, 
COUNT(*) AS rental_count 
from owners as o 
join products as p on o.id = p."ownerId"
join contracts as c on c."productId" = p.id
join categories as cat on cat.id = p."categoryId"
where cat.name = $1
group by o.id, o.user_name, o.email
order by rental_count desc
limit 10;
    `,
      [category]
    );
    res.status(200).send({ result: result.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};

const paymentsQuery = async (req, res) => {
  try {
    const { client_email } = req.body;
    const result = await pool.query(
      `
     select pay.amount, pay.payment_method, pay.is_paid, pay.paid_at, pay.transaction_code , 
cat.name as category_name, p.name as product_name, o.email as owner_email from payments as pay 
join contracts as c on c.id = pay."contractId"
join clients as cl on cl.id = c."clientId"
join products as p on p.id = c."productId"
join owners as o on o.id = p."ownerId"
join categories as cat on cat.id = p."categoryId"
where cl.email = $1
    `,
      [client_email]
    );
    res.status(200).send({ result: result.rows });
  } catch (error) {
    errorHandler(error, res);
  }
};



module.exports = {
  getProductsByDate,
  getClientsByDemages,
  getClientsByRejected,
  countBestOwners,
  paymentsQuery
};
