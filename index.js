const express = require('express');
const uuid = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://dev-burger-react.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

const port = 3001

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params;
    const index = orders.findIndex(order => order.id === id);

    index < 0 && response.status(404).json({ error: 'Order not found' })

    request.orderIndex = index;
    request.orderId = id;

    next();
};

const showMethodAndUrl = (request, response, next) => {
    console.log(`[${request.method}] - ${request.url}`);

    next();
};


app.get('/order', showMethodAndUrl, (request, response) => {
    return response.json(orders)
})

app.post('/order', showMethodAndUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const orderData = {id: uuid.v4(), order, clientName, price, status: "Em preparação"}
    orders.push(orderData)
    return response.status(201).json(orderData)
})

app.put('/order/:id', checkOrderId, showMethodAndUrl, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrder = {id, order, clientName, price, status}
    orders[index] = updateOrder

    return response.json(updateOrder)
})

app.delete('/order/:id', checkOrderId, showMethodAndUrl, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkOrderId, showMethodAndUrl, (request, response) => {
    const index = request.orderIndex;

    return response.json(orders[index]);
});

app.patch('/order/:id', checkOrderId, showMethodAndUrl, (request, response) => {
    const id = request.orderId
    const order = orders.find(order => order.id === id)
    order.status = "Pronto"

    return response.json(order);
})

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`)
})