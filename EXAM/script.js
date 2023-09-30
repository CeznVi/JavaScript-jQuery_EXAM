$(document).ready(() => {

    //// * Переменная для сохранения всех полученных данных из сети
    var productsData = {
        products: null,
        categories: [],
        brands: []
    };



    //// * Информационная таблица
    var $tableProduct = $('.table-products');

    //// ? --------------- Определение кнопок
    //// * Кнопка поиск
    var $searhBtn = $('#buttonSearch');
    //// * Кнопка рестарт
    var $restrtBtm = $('#buttonRestart');
    //// * Кнопка применить значения фильтра брендов
    var $applyBrandsFilterBtn = $('#ApplyBrandButton');
    //// * Кнопка применить значения фильтра категории
    var $applyCategoryFilterBtn = $('#ApplyCategoryButton');
    //// * Кнопка применить значения фильтра цены
    var $applyPriceFilterBtn = $('#ApplyPrice');

    //// ? --------------- Определение параметров модального окна
    var $modalWindowTitle = $('#exampleModalLabel');
    var $modalWindowProductImage = $('#product-image');
    var $modalWindowProductDescr = $('#product-descr');
    var $modalWindowByuBtn = $('#product-buyBtn');
    //// ? -----------------------------------

    //// ? --------------- Определение полей
    //// * Поле для ввода поисковой строки
    var $textAreaSeach = $('#textSearch');
    //// * Поле выбора брендов
    var $BrandsSelect = $('#BrandsSelect');
    //// * Поле выбора категорий
    var $categorySelect = $('#CategoriesSelect');
    //// * Поле минимальной цены
    var $priceFrom = $('#PriceFrom');
    //// * Поле максимальной цены
    var $priceTo = $('#PriceTo');

    //// ? -----------------------------------


    //// ? --------------- Назначение обработчиков на кнопки
    //// ! Обработчик кнопки Сброс "КЛИК"
    $restrtBtm.on('click', (e) => {
        filteredProduc = null;
        $tableProduct.empty();
        $BrandsSelect.val('Все бренды');
        $categorySelect.val('Все категории');
        $priceFrom.val(null);
        $priceTo.val(null);
        renderTable(productsData.products, $tableProduct);
    });

    //// ! Обработчик кнопки поиск "КЛИК"
    $searhBtn.on('click', (e) => {
        let text = $textAreaSeach.val();
        let product = [];

        if (text.length >= 3) {
            productsData.products.forEach((p) => {
                if (p.title.toLowerCase().includes(text.toLowerCase())) {
                    product.push(p)
                }
            });

            if (product.length >= 1) {
                $tableProduct.empty();
                renderTable(product, $tableProduct);
            } else {
                alert('По заданому запросу данных не обнаружено')
                $tableProduct.empty();
                renderTable(productsData.products, $tableProduct);
            }

        }
    });

    //// ! Обработчик кнопки Применить фильтр Брендов "КЛИК"
    $applyBrandsFilterBtn.on('click', (e) => {
        let filter = $BrandsSelect.val();

        let product = [];

        productsData.products.forEach((p) => {
            if (p.brand.includes(filter)) {
                product.push(p)
            }
        });

        if (product.length >= 1) {
            $tableProduct.empty();
            renderTable(product, $tableProduct);
        } else {  //// ! на случай если выбрано "Все.." - рендерим таблицу со всеми данными
            $tableProduct.empty();
            renderTable(productsData.products, $tableProduct);
        }

    });
    //// ! Обработчик кнопки Применить фильтр Категорий "КЛИК"
    $applyCategoryFilterBtn.on('click', (e) => {
        let filter = $categorySelect.val();

        let product = [];

        productsData.products.forEach((p) => {
            if (p.category.includes(filter)) {
                product.push(p)
            }
        });

        if (product.length >= 1) {
            $tableProduct.empty();
            renderTable(product, $tableProduct);
        } else {  //// ! на случай если выбрано "Все.." - рендерим таблицу со всеми данными
            $tableProduct.empty();
            renderTable(productsData.products, $tableProduct);
        }
    });

    $applyPriceFilterBtn.on('click', (e) => {
         
        let product = [];

        productsData.products.forEach((p) => {
            if (p.price >= $priceFrom.val() && p.price <= $priceTo.val()) {
                product.push(p)
            }
        });

        if (product.length >= 1) {
            $tableProduct.empty();
            renderTable(product, $tableProduct);
        } else {  //// ! на случай если выбрано "Все.." - рендерим таблицу со всеми данными
            $tableProduct.empty();
            renderTable(productsData.products, $tableProduct);
        }
    });

    //// ? --------------------------------------------------


    //// ? --------------- Функции --------------------------
    //// ! Рендер заголовка таблици
    var renderHeader = (option) => {
        let $row = $("<tr>");
        option.forEach((opt) => {

            if(opt == 'id') {
                $row.append($('<th>').text('Id'));
            } else if (opt == 'title') {
                $row.append($('<th>').text('Название'));
            } else if (opt == 'price') {
                $row.append($('<th>').text('Цена'));
            } else if (opt == 'rating') {
                $row.append($('<th>').text('Рейтинг'));
            } else if (opt == 'brand') {
                $row.append($('<th>').text('Бренд'));
            } else if (opt == 'category') {
                $row.append($('<th>').text('Категории'));
            }

        });

        return $row;
    }

    //// ! Рендер одной строки таблици
    var renderOneRow = (product, options) => {
        let $row = $("<tr>");

        for (const productKey in product) {
            for (let i = 0; i < options.length; i++) {
                if (options[i] === productKey) {
                    $row.append($('<td>').text(product[productKey]));
                }
            }

            $row.attr({
                'data-bs-toggle': 'modal',
                'data-bs-target': '#exampleModal'
                });

            $row.on('click', () => {
                $modalWindowTitle.text(product.title);
                $modalWindowProductImage.attr({
                    src: product.images[0],
                });
                $modalWindowProductDescr.text(product.description);
                $modalWindowByuBtn.text("Купить " + product.price + "$");
            });

        }

        return $row;
    }


    //// ! Рендер таблици
    var renderTable = function (products, $parent) {
        var renderOption = ['id', 'title', 'price', 'rating', 'brand', 'category'];

        $parent.append(renderHeader(renderOption));

        products.forEach((oneProduct) => {
            $parent.append(renderOneRow(oneProduct, renderOption));
        });
    }

    //// ! Выгрузка из продуктов списка брендов
    var loadProductsBrand = function () {
        let listBrand = [];

        var opt = document.createElement('option');
        opt.value = 'Все бренды';
        opt.innerHTML = 'Все бренды';
        $BrandsSelect.append(opt);

        productsData.products.forEach((p) => {
            if (productsData.brands.includes(p.brand) == false) {
                opt = document.createElement('option');
                opt.value = p.brand;
                opt.innerHTML = p.brand;
                $BrandsSelect.append(opt);
                productsData.brands.push(p.brand);
            }
        });

        $BrandsSelect.val('Все бренды');
    }

    //// ! Выгрузка из продуктов списка категорий
    var loadProductsCategory = function () {
        let listCategory = [];

        var opt = document.createElement('option');
        opt.value = 'Все категории';
        opt.innerHTML =  'Все категории';
        
        $categorySelect.append(opt);

        productsData.products.forEach((p) => {
            if (productsData.categories.includes(p.category) == false) {
                opt = document.createElement('option');
                opt.value = p.category;
                opt.innerHTML = p.category;
                $categorySelect.append(opt);
                productsData.categories.push(p.category);
            }
        });

        $categorySelect.val('Все категории');
    }


    //// ! Загрузка данных
    $.ajax({
        method: 'GET',
        url: 'https://dummyjson.com/products??skip=0&limit=100'
    }).done((data) => {
        productsData.products = data.products;
        renderTable(productsData.products, $tableProduct);
        loadProductsBrand();
        loadProductsCategory();
    })

    //// * ----------------------------------------
    var changeAviableBrand = function (brandList) {
        brandList.forEach((b) => {
            var opt = document.createElement('option');
            opt.value = b;
            opt.innerHTML = b;
            $BrandsSelect.append(opt);
        });
    }

    //// ? --------------------------------------------------


});