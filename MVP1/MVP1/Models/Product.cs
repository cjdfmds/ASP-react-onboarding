﻿using System;
using System.Collections.Generic;

namespace MVP1.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Price { get; set; }

    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
