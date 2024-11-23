let data = [];
//得到產品資料
function getProductData() {
    axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/chris/products')
        .then(res => {
            data = res.data.products;
            renderProductData();
            // console.log(data[0]);

        })
        .catch(error => {
            console.log(error);
        })
}
function init() {
    getProductData();
    getCartData();
}
init();

const productWrap = document.querySelector('.productWrap');
//渲染產品資料
function renderProductData() {
    let str = '';
    data.forEach(product => {
        str += renderProduct(product);
    })
    productWrap.innerHTML = str;
}
//篩選產品品項
const productSelect = document.querySelector('.productSelect');
productSelect.addEventListener('change', (e) => {
    const category = e.target.value;
    console.log(category);
    let str = '';
    data.forEach(product => {
        if (category === product.category) {
            str += renderProduct(product);
        }
        productWrap.innerHTML = str;
    })
})

//渲染字串處理
function renderProduct(product) {
    return ` <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src='${product.images}'>
                <a href="#" class="addCardBtn" data-id='${product.id}'>加入購物車</a>
                <h3>${product.title}</h3>
                <del class="originPrice">NT$${product.origin_price}</del>
                <p class="nowPrice">NT$${product.price}</p>
            </li>`
}

//得到購物車
let carts = [];
function getCartData() {

    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(res => {
            carts = res.data.carts;
            console.log(carts);
            renderCart();
        })
        .catch(error => {
            console.log(error);
        })
}
//渲染購物車資料
const cartTotal = document.querySelector('.cart-total');

const shoppingCartTbody = document.querySelector('.shoppingCart-tbody');
function renderCart() {
    let str = '';
    let totalPrice = 0;
    carts.forEach(cart => {
        const cartTotalPrice = cart.product.price * cart.quantity;
        totalPrice += cartTotalPrice;
        str += `<tr><td>
        <div class="cardItem-title">
            <img src="${cart.product.images}" alt="cart">
            <p>${cart.product.title}</p>
        </div>
    </td>
    <td>NT$${cart.product.price}</td>
    <td>${cart.quantity}</td>
    <td>NT$${cartTotalPrice}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-id='${cart.id}'>
            clear
        </a>
    </td>
    </tr>`
    })
    shoppingCartTbody.innerHTML = str;
    cartTotal.textContent = totalPrice;
}
// const shoppingCartTable = document.querySelector('.shoppingCart-table');

// 加入購物車
productWrap.addEventListener('click', (e) => {
    e.preventDefault();
    const dataId = e.target.getAttribute('data-id');
    if (dataId == null) {
        console.log('沒點擊到購物車')
        return
    }
    let cartNum = 1;
    carts.forEach((cart, index) => {
        if (cart.product.id === dataId) {
            cartNum = ++cart.quantity;
        }
    })
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
        {
            "data": {
                "productId": dataId,
                "quantity": cartNum
            }
        })
        .then(res => {
            getCartData();
        })
        .catch(error => {
            console.log(error);
        })
})

//刪除所有品項
const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(res => {
            getCartData();
        })
        .catch(error => {
            console.log(error);
        })
})

//刪除購物車產品
const shoppingCartTable = document.querySelector('.shoppingCart-table');
shoppingCartTable.addEventListener('click', (e) => {
    e.preventDefault();
    const targetClass = e.target.getAttribute('class');
    const id = e.target.getAttribute('data-id');
    if (targetClass === null) {
        console.log(targetClass)
        return
    }
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${id}`)
        .then(res => {
            getCartData();
        })
        .catch(error => {
            console.log(error);
        })
})
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerEmail = document.querySelector('#customerEmail');
const customerAddress = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');
const orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (customerName.value === '' || customerPhone.value === '' || customerEmail.value === '' || customerAddress.value === '' || tradeWay.value === '') {
        alert('欄位不得為空白');
        return
    }
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`, {
        "data": {
            "user": {
                "name": customerName.value,
                "tel": customerPhone.value,
                "email": customerEmail.value,
                "address": customerAddress.value,
                "payment": tradeWay.value
            }
        }
    })
        .then(res => {
            console.log(res);
            alert('成功送出訂單');
            getCartData();
            cleanInput()
        })
        .catch(error => {
            console.log(error);
        })
})
function cleanInput() {
    customerPhone.value = '';
    customerName.value = '';
    customerPhone.value = '';
    customerEmail.value = '';
    customerAddress.value = '';
    tradeWay.value = 'ATM';
}