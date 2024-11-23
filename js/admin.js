// 預設 JS，請同學不要修改此處
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if (menu.classList.contains('openMenu')) {
        menu.classList.remove('openMenu');
    } else {
        menu.classList.add('openMenu');
    }
}
function closeMenu() {
    menu.classList.remove('openMenu');
}

// 抓到訂單資料
let orderData = [];
function getOrderData() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            Authorization: token
        },
    })
        .then(res => {
            orderData = res.data.orders;
            renderOrderData();
            renderC3();
        })
        .catch(error => {
            console.log(error);
        })
}
getOrderData();

//渲染訂單
const orderPageTbody = document.querySelector('.orderPage-tbody');
function renderOrderData() {
    let str = '';
    let orderProduct = '';

    //日期字串
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const orderDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    orderData.forEach(order => {
        //訂單狀態
        // console.log(order.paid);
        let orederPaid;
        if (order.paid === true) {
            orderPaid = '已處理';
        }
        else {
            orderPaid = '未處理';
        }
        //產品字串
        order.products.forEach(i => {
            orderProduct += `<div>${i.title}*${i.quantity}</div>`
        })
        str += `<tr>
    <td>${order.id}</td>
    <td>
      <p>${order.user.name}</p>
      <p>${order.user.tel}</p>
    </td>
    <td>${order.user.address}</td>
    <td>${order.user.email}</td>
    <td>
      <p>${orderProduct}</p>
    </td>
    <td>${orderDate}</td>
    <td>
      <a class="orderStatus" href="#" data-id='${order.id}'>${orderPaid}</a>
    </td>
    <td>
      <input type="button" class="delSingleOrder-Btn" data-id=${order.id} value="刪除">
    </td>
</tr>`
    })
    orderPageTbody.innerHTML = str;
}

//刪除全部訂單
const discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click', (e) => {
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        headers: {
            Authorization: token
        },
    })
        .then(() => {
            getOrderData();
        })
        .catch(error => {
            console.log(error);
        })
})
//觸發訂單
orderPageTbody.addEventListener('click', (e) => {
    e.preventDefault();
    const orderStatus = document.querySelector('.orderStatus');
    const targetClass = e.target.getAttribute('class');
    const id = e.target.getAttribute('data-id');
    const status = orderStatus.textContent;
    if (targetClass !== 'orderStatus' && targetClass !== 'delSingleOrder-Btn') {
        return
    }
    else if (targetClass == 'orderStatus') {
        changeOrderStatus(id, status);
    }
    else if (targetClass == 'delSingleOrder-Btn') {
        delOrder(id);
    }
})
//改變訂單狀態
function changeOrderStatus(id, status) {
    let newStatus = '';
    if (status === '未處理') {
        newStatus = true;
    }
    else {
        newStatus = false;
    }
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`, {
        "data": {
            "id": id,
            "paid": newStatus
        }
    }, {
        headers: {
            Authorization: token
        },
    }
    )
        .then(() => {
            getOrderData();
        })
        .catch(error => {
            console.log(error);
        })
}
//刪除訂單
function delOrder(id) {
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`, {
        headers: {
            Authorization: token
        },
    }
    )
        .then(() => {
            getOrderData();
        })
        .catch(error => {
            console.log(error);
        })
}
// 渲染圖表
function renderC3() {
    let obj = {};
    orderData.forEach(order => {
        order.products.forEach(product => {
            console.log();
            const productTotal = product.price * product.quantity
            const category = product.category;
            if (obj[category]) {
                obj[category] += productTotal
            }
            else {
                obj[category] = productTotal
            }
        })
    })
    const arr = Object.entries(obj)
    const chart = c3.generate({
        data: {
            columns: arr,
            type: 'pie',
        },
        color: {
            pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"]
        }
    });
}
