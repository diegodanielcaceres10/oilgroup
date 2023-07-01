// Define modules
const storage = require("../modules/storage");
const moment = require("moment");

exports.getAll = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: metric/getAll |";

        // Define user
        let user = req.body.user;
        let filter = "";
        if (user) {
            user = user.replace(/'/gi, "").toLowerCase();
            await storage.exists_row(req, res, session, "select*from user where username='" + user + "'");
            filter = "and user='" + user + "'"
        }

        // Define metric
        let metric = {};
        await storage.run_query(req, res, session, "SET lc_time_names = 'es_ES'");
        metric.sales = await storage.get_data(req, res, session, "select date_format(datetime, '%M')item,sum(total)total from sale where datetime>date_format(curdate()-interval 2 month,'%Y-%m-01')and status!='Cancelada'and status!='Inicial'" + filter + "group by item order by datetime desc");
        metric.payments = await storage.get_data(req, res, session, "select date_format(datetime, '%M')item,sum(import)total from customer_payment where datetime>date_format(curdate()-interval 2 month,'%Y-%m-01')and status!='Cancelado'" + filter + "group by item order by datetime desc");
        metric.documents = await storage.get_data(req, res, session, "select ifnull(document,'N/A')type,sum(total)total from sale where date_format(datetime,'%M')=date_format(curdate(),'%M')and status!='Inicial'and status!='Cancelada'" + filter + "group by document order by total");
        metric.methods = await storage.get_data(req, res, session, "select ifnull(method,'N/A')type,sum(import)total from customer_payment where date_format(datetime,'%M')=date_format(curdate(),'%M')and status!='Cancelado'" + filter + "group by method order by total");

        // Define response
        return res.status(200).send({ status: "success", data: metric });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};

exports.getAllExtend = async (req, res) => {
    try {
        let session = "Username: " + (req.headers.username || "undefined") + " | API: metric/getAllExtend |";

        // Define metric
        let metric = {};
        metric.pending = await storage.get_value(req, res, session, "select count(*)value from sale where status='Pendiente'");
        metric.ready = await storage.get_value(req, res, session, "select count(*)value from sale where status='Lista'");
        metric.billing = await storage.get_value(req, res, session, "select count(*)value from sale where billing and billing_date is null and status!='Cancelada'and status!='Inicial'");

        // Define articles metric
        metric.prices = await storage.get_value(req, res, session, "select count(*)value from article a left join price p on article=a.id where price_list is null");
        metric.stock = await storage.get_value(req, res, session, "select count(*)value from article a left join(select article,sum(units)buy from buy_detail,buy where buy=id and status='Aprobada'group by article)b on b.article=a.id left join(select article,sum(stock)sale from sale_detail,sale s where sale=s.id and deleted=0 and status!='Pendiente'and status!='Cancelada'and status!='Inicial'group by article)s on s.article=a.id left join(select article,sum(units)stock from stock group by article)st on st.article=a.id where ifnull(buy,0)+ifnull(stock,0)-ifnull(sale,0)<1");

        // Define grafics metris
        metric.articles = await storage.get_data(req, res, session, "select article,concat(a.brand,' ',a.name)item,ifnull(sum(subtotal),0)total from sale_detail,sale s,article a where sale=s.id and article=a.id and deleted=0 and status!='Pendiente'and status!='Cancelada'and status!='Inicial'and(month(datetime)=month(curdate())or month(datetime)=month(curdate()-interval 1 month)or month(datetime)=month(curdate()-interval 2 month))group by article order by total desc limit 5");
        metric.brands = await storage.get_data(req, res, session, "select(brand)item,ifnull(sum(subtotal),0)total from sale_detail,sale s,article a where sale=s.id and article=a.id and deleted=0 and status!='Pendiente'and status!='Cancelada'and status!='Inicial'and(month(datetime)=month(curdate())or month(datetime)=month(curdate()-interval 1 month)or month(datetime)=month(curdate()-interval 2 month))group by brand order by total desc limit 5");
        metric.categories = await storage.get_data(req, res, session, "select(category)item,ifnull(sum(subtotal),0)total from sale_detail,sale s,article a where sale=s.id and article=a.id and deleted=0 and status!='Pendiente'and status!='Cancelada'and status!='Inicial'and(month(datetime)=month(curdate())or month(datetime)=month(curdate()-interval 1 month)or month(datetime)=month(curdate()-interval 2 month))group by category order by total desc limit 5");
        metric.customers = await storage.get_data(req, res, session, "select(fantasy_name)item,ifnull(sum(total),0)total,ifnull(sum(import),0)payment from customer cm left join sale s on s.customer=cm.id and s.status!='Cancelada'and s.status!='Inicial'left join customer_payment p on p.customer=cm.id and p.status='Aprobado'group by cm.id order by total desc limit 5");
        metric.providers = await storage.get_data(req, res, session, "select(fantasy_name)item,ifnull(sum(total),0)total,ifnull(sum(import),0)payment from provider pr left join buy b on b.provider=pr.id and b.status!='Cancelada'and b.status!='Inicial'left join provider_payment p on p.provider=pr.id and p.status='Aprobado'group by pr.id order by total desc limit 5");

        // Define response
        return res.status(200).send({ status: "success", data: metric });
    } catch (err) {
        console.error(moment().format(), err);
        return res.status(500).send({ status: "error", error: err.message });
    };
};
