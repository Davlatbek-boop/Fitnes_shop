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
      SELECT cl.id, cl.user_name, cl.last_name, cl.email, cl.phone, cl.address, p.description as prod_desc
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
      SELECT cl.id, cl.user_name, cl.last_name, cl.email, cl.phone, cl.address, c.id as contractID
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
      select 
      o.id, o.user_name, o.email, p.name as product,
      COUNT(*) AS rental_count 
      from owners as o 
join products as p on o.id = p."ownerId"
join contracts as c on c."productId" = p.id
join categories as cat on cat.id = p."categoryId"
where cat.name = $1
group by o.id, o.user_name, o.email, p.name
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
    const { client_email, category_name, product_name } = req.body;
    const result = await pool.query(
      `
     SELECT 
    pay.amount AS payment_amount,
    pay.payment_method AS method,
    pay.is_paid AS is_payment_done,
    pay.paid_at AS payment_date,
    pay.transaction_code AS transaction_id,
    cat.name AS category_name,
    p.name AS product_name,
    p.description AS product_description,
    o.email AS owner_email 
    FROM payments AS pay
JOIN contracts AS c ON c.id = pay."contractId"
JOIN clients AS cl ON cl.id = c."clientId"
JOIN products AS p ON p.id = c."productId"
JOIN owners AS o ON o.id = p."ownerId"
JOIN categories AS cat ON cat.id = p."categoryId"
JOIN statuses AS st ON st.id = c."statusId"
WHERE st.name = 'approved' AND
cl.email = $1 AND
cat.name = $2 AND
p.name = $3;

    `,
      [client_email, category_name, product_name]
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
