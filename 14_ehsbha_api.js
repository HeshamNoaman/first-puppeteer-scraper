import axios from 'axios';
import { saveToJson, wait } from './utils/puppeteerUtils.js';

let numberOfProducts = 0;

const productsPerPage = 48;
let currentPage = 0;
let totalPages = 0;

let skip = productsPerPage * currentPage;

let allProducts = [];

const url = 'https://api3.ehsbha.com/graphql';

const requestBody = {
  operationName: 'QueryAllProducts',
  variables: {
    where: {
      status: 'PUBLISH',
      categories: {
        some: {
          id: {
            in: [1, 23, 24, 29, 980, 292, 293, 294, 295, 296, 297, 298, 299, 300, 304]
          }
        }
      },
      storeProduct: {
        some: {
          price: {
            gte: 0,
            lte: 5000
          }
        }
      }
    },
    take: productsPerPage, // can be 24 or 48 the number of product ot get
    skip: skip, // formal is skip * $take
    orderBy: {
      updatedAt: 'desc'
    },
    featureWhere: {
      name_ar: { not: null },
      value_ar: { not: null }
    },
    featureWhere2: {
      name_ar: { not: null },
      value_ar: {
        notIn: [
          "منصة", "رقم الموديل", "الخامة", "السعة (باللترات)", "شكل مفرغ", "ارتفاع / مم", "العرض / مم", "الإكسسوارات مرفقة", "العمق / مم", "حاوية جمع الغبار", "فلتر", "نوع الأرضية", "نوع المقبس", "منفذ الطاقة", "مقاوم لتكون الأملاح", "مقاوم للتنقيط", "البخار العمودي", "بخاخ الماء", "المميزات", "تقنية البطارية القابلة لإعادة الشحن", "الوظائف", "حجم التخزين / لترات", "مزود بكمبروسور (ضاغط)", "لا تكون للجليد (نو-فروست)", "العرض / سم", "عمق / مم", "عدد اللمبات", "تبريد", "مجفف/منشفة مدمجة", "طبل المواد", "طبل نوع", "منسوب ارتفاع المياه / لتر", "برامج غسيل إضافية", "السرعة القصوى للتنشيف (دورة في الدقيقة)", "التشغيل بالنابض", "طاقة الغسيل (باور ووش)", "نوع موتور الغسالة", "برامج الغسيل", "تعبئة المياه", "إعدادات المكان", "رف الصحون", "مستوى الضوضاء", "مساحة التغطية المكانية", "التردد", "سلة أدراج", "رف الفريزر", "قدرة انترنت واي فاي", "مطحنة", "السعة (مللي)", "مجموعة ماكينة الاسبريسو القابلة للإزالة", "إبريق حراري", "سعة الخزان / لتر", "حامل الزجاج", "سعة التدفئة / وحدة حرارية بريطانية", "مزود بمدخنة", "نوع التركيب", "الحد الأقصى للطول / مم", "فلتر إزالة الروائح", "إعدادات السرعة", "ساعة", "عملية طبخ لطيفة", "باب زجاجي", "لمبة فرن", "التسخين المسبق", "سخان", "طول الكابل الكهربائي/الأمتار", "أرفف كاسات", "تشطيب داخلي", "لوحة التحكم", "سهل التنظيف", "لوحة الاحتفاظ بالحرارة", "عدد الأشرطة", "موقع قارورة المياه", "إزالة الترسبات التلقائي", "محاسب", "خيارات الشراب", "شاشة عرض إل سي دي", "صانعة رغوة الحليب", "لغات متعددة", "أضواء تحذيرية", "خزان المياه / لتر", "شواية", "صنع فى", "سرعة الدوران", "الفولت/التردد", "رقم الموديل", "السعة بالليتر/بالقدم", "قابل للتحويل إلى ثلاجة", "غير قابل للتجمد", "رقم الموديل", "رقم المنتج", "نوع غاز التبريد", "عدد الأبواب / الأدراج", "الارتفاع", "بلت إن", "التصميم", "توصيل ذكي", "null", "استهلاك الطاقة السنوي", "ساق موازنة قابلة للتعديل", "الوزن", "العمق", "نوع التثبيت", "التردد", "اسم المنتج", "طراز المنتج", "السعة (باللترات)", "الوظائف", "الطاقة / وات", "الوزن (كجم)", "ارتفاع / مم", "العرض / مم", "نوع الطاقة", "نوع المنتج", "عمق / مم", "غلق أمان ضد الأطفال", "ساعة", "باب زجاجي", "لمبة فرن", "التسخين المسبق", "عدد الشعلات / حلقات", "نوع الفرن", "عدد اللمبات", "مزود بمدخنة", "الحد الأقصى للطول / مم", "نوع المقبس", "الضمان", "إعدادات السرعة", "null", "الساعة", "حجم الفرن", "عدد شعلات الموقد", "رقم المنتج", "نوع الموقد", "صافي سعة الفرن", "العرض بالسنتيميتر", "السعة", "عمق / مم", "الارتفاع ", "الوزن (كجم)", "العرض / سم", "رقم الموديل", "الطاقة / وات", "ارتفاع / مم", "فلتر", "مزود بمدخنة", "نوع التركيب", "إعدادات السرعة", "السعة (باللترات)", "نوع المقبس", "الوظائف", "سعة البخار", "فلتر كربون", "العرض بالسنتيميتر", "السرعات", "عدد المواتير", "إضافات", "فولت", "العمق", "الطاقة / وات", "رقم الموديل", "مرجع", "Material", "العمق", "الوات", "الوزن", "إضافات", "مصدر الطاقة", "Service Contacts", "مرجع", "الوات", "تخزين الاكواب", "أقصى الحمولة", "سعة الماء الساخن", "عدد المستخدمين", "المجموعة المستهدفة", "عدد مراكز التعديل", "العمق / مم", "الوزن (كجم)", "مساحة التغطية المكانية", "السعة (باللترات)", "منطقة التغطية", "عمق الوحدة الخارجية", "التثبيت مطلوب ", "بلت إن", "تصنيف الغبار وفق رابطة مصنعي الأجهزة المنزلية", "استهلاك الطاقة السنوي", "نوع غاز التبريد", "طراز المنتج", "Cooling Capacity", "النوع", "مقاوم للتنقيط", "خاصية تنوع درجة البخار", "البخار العمودي", "بخاخ الماء", "صينية تسخين", "إطفاء تلقائي", "باور"
        ]
      }
    },
    product: {
      status: 'PUBLISH',
      categories: {
        some: {
          id: {
            in: [1, 23, 24, 29, 980, 292, 293, 294, 295, 296, 297, 298, 299, 300, 304]
          }
        }
      },
      storeProduct: {
        some: {
          price: {
            gte: 0,
            lte: 5000
          }
        }
      }
    }
  },
  query: `
    query QueryAllProducts(
      $where: ProductWhereInput,
      $take: Int,
      $skip: Int,
      $orderBy: [ProductOrderByInput!],
      $featureWhere: ProductFeatureWhereInput,
      $featureWhere2: ProductFeatureWhereInput
    ) {
      products(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
        id
        name
        name_ar
        slug
        slug_ar
        images(take: 1) {
          id
          src
          __typename
        }
        features(take: 4, where: $featureWhere) {
          id
          name
          name_ar
          value
          value_ar
          __typename
        }
        storeProduct {
          id
          price
          salePrice
          url
          location {
            id
            store {
              id
              name
              logo
              slug
              slug_ar
              __typename
            }
            __typename
          }
          __typename
        }
        favourites {
          id
          user {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      productFeatures(where: $featureWhere2, take: 30) {
        id
        name
        name_ar
        value
        value_ar
        __typename
      }
      productCategories(where: { products: { some: $where } }) {
        id
        __typename
      }
      productsCount(where: $where)
    }
  `
};

async function fetchCurrentPageData() {
  try {
    // update the value fo skip
    requestBody.variables.skip = productsPerPage * currentPage;

    const response = await axios.post(url, requestBody);

    // get the data from the response
    const products = response.data.data.products;

    // save data
    allProducts = allProducts.concat(products);

    // get the number of products from the response
    numberOfProducts = response.data.data.productsCount;

    // calculate the number of page base on the number of product divided by producs per page
    if (numberOfProducts) {
      totalPages = Math.ceil(numberOfProducts / productsPerPage);
    }

    console.log(`Fetched products from page ${currentPage + 1} / ${totalPages}`);
    console.log(`total products fetched are ${products.length} \n`);

  } catch (error) {
    console.error(error);
  }
}

async function getAllProducts() {
  while (currentPage < totalPages) {

    await fetchCurrentPageData();

    // Add a delay between fetches
    await wait(1000);

    currentPage++
  }
}

// initial request to get the number of products and pages
await fetchCurrentPageData();
currentPage++

console.log(`the total products are ${numberOfProducts}`);

// get the rest of the data
await getAllProducts();

saveToJson(allProducts, 'output/ehsbha_all_products.json');
