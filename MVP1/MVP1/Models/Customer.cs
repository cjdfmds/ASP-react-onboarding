using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MVP1.Models;

public partial class Customer
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Address { get; set; } = null!;

    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
