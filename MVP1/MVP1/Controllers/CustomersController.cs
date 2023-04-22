using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MVP1.Models;

namespace MVP1.Controllers
{   
    [ApiController]
    [Route("api/customers")]   
    public class CustomersController : Controller
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //
            context.HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "https://localhost:44465");
            base.OnActionExecuting(context);
        }
        private readonly MyStoreContext _context;

        public CustomersController(MyStoreContext context)
        {
            _context = context;
           
        }

        // GET: Customers
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            //individually allows CORS for ea function, we dont want this.
            //Response.Headers.Add("Access-Control-Allow-Origin", "*");

            var customers = await _context.Customers.ToListAsync();
            return Ok(customers);
        }



        // GET: Customers/Details/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Customers == null)
            {
                return NotFound();
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(m => m.Id == id);
            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }


        // POST: Customers/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<IActionResult> Create([Bind("Id,Name,Address")] Customer customer)
        {        
            if (ModelState.IsValid)
            {
                _context.Add(customer);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Customers == null)
            {
                return NotFound();
            }

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }
            return View(customer);
        }

        // POST: Customers/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
           
        // GET: Customers/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Customers == null)
            {
                return NotFound();
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(m => m.Id == id);
            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }
                
        private bool CustomerExists(int id)
        {
          return (_context.Customers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
