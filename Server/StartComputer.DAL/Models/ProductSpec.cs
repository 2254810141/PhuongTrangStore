using System;
using System.Collections.Generic;

namespace Server.Models;

public partial class ProductSpec
{
    public int SpecId { get; set; }

    public int ProductId { get; set; }

    public string? Cpu { get; set; }

    public string? Ram { get; set; }

    public string? Storage { get; set; }

    public string? Gpu { get; set; }

    public string? ScreenSize { get; set; }

    public string? Os { get; set; }

    public virtual Product Product { get; set; } = null!;
}
