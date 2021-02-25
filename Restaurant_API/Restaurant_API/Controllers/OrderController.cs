using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Restaurant_API.Models;

namespace Restaurant_API.Controllers
{
    public class OrderController : ApiController
    {
        private DBModel db = new DBModel();

        // GET: api/Order
        //public IQueryable<Order> GetOrders()
        // we return the object hence changing the return type
        public System.Object GetOrders()
        {
            //linq expression to display the customer's order details

            var result = (from a in db.Orders
                          join b in db.Customers on a.CustomerID equals b.CustomerID

                          select new
                          {
                              a.OrderID,
                              a.OrderNo,
                              Customer = b.Name,
                              a.PayMethod,
                              a.GrandTotal,


                          }).ToList();
            
            return result;
        }

        // GET: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult GetOrder(long id)
        {
            //Order order = db.Orders.Find(id);
            //if (order == null)
            //{
            //    return NotFound();
            //}

            //return Ok(order);

            //this is similar ot peroperty formdata in orderservice.ts
           // this is done ro etrive the order information of particular order in the orderS page
            
            var order = ( from a in db.Orders
                         where a.OrderID == id

                         select new{
                         a.OrderID,
                         a.OrderNo,
                         a.CustomerID,
                         a.PayMethod,
                         a.GrandTotal,
                         DeletedOrderItemIDs=""
                         }
            ).FirstOrDefault();

            //retrive food items in the order
            var orderDetails = ( from a in db.OrderItems join b in db.Items
                                 on a.ItemID equals b.ItemID
                                 where a.OrderID == id

                                 select new
                                 {
                                     a.OrderID,
                                     a.OrderItemID,
                                     a.ItemID,
                                     ItemName = b.Name,
                                     b.Price,
                                     a.Quantity,
                                     Total= a.Quantity * b.Price

                                 }
                ).ToList();

            return Ok(new { order, orderDetails });
        }

        //put is not required coz edit is can be done in PostOrder
        // PUT: api/Order/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutOrder(long id, Order order)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != order.OrderID)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(order).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!OrderExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // POST: api/Order
        
        [ResponseType(typeof(Order))]
        public IHttpActionResult PostOrder(Order order)
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}
            //cox validation is done on the client side already

            try {

                //insert into order table

                if (order.OrderID == 0)
                    db.Orders.Add(order); //add/insert new into order table
                else
                    db.Entry(order).State = EntityState.Modified;

                //insert into order items table
                foreach (var item in order.OrderItems) {
                    if (item.OrderItemID == 0)
                        db.OrderItems.Add(item);
                    else
                        db.Entry(item).State = EntityState.Modified;
                }

                //delete for order item
                foreach (var id in order.DeletedOrderItemIDs.Split(',').Where(x => x != ""))
                {
                    OrderItem x = db.OrderItems.Find(Convert.ToInt64(id));
                    db.OrderItems.Remove(x);
                }

                db.SaveChanges();

                //return CreatedAtRoute("DefaultApi", new { id = order.OrderID }, order);
                return Ok();
            }
            catch (Exception ex) {
                throw ex;
            }
            }

        // DELETE: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult DeleteOrder(long id)
        {
            //Order order = db.Orders.Find(id);
            //if (order == null)
            //{
            //    return NotFound();
            //}
            Order order = db.Orders.Include(y=> y.OrderItems)
                .SingleOrDefault(x => x.OrderID == id);

            foreach (var item in order.OrderItems.ToList()) {
                db.OrderItems.Remove(item);
            }

            db.Orders.Remove(order);
            db.SaveChanges();

            return Ok(order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderExists(long id)
        {
            return db.Orders.Count(e => e.OrderID == id) > 0;
        }
    }
}