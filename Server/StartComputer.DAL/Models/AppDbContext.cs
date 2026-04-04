using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace StartComputer.DAL.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Accessory> Accessories { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductSpec> ProductSpecs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;port=3306;database=start_computer;user=root;password=hoang20122004H@", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.45-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Accessory>(entity =>
        {
            entity.HasKey(e => e.AccessoryId).HasName("PRIMARY");

            entity.ToTable("accessories");

            entity.Property(e => e.AccessoryId).HasColumnName("accessory_id");
            entity.Property(e => e.AccessoryName)
                .HasMaxLength(200)
                .HasColumnName("accessory_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.Description)
                .HasColumnType("text")
                .HasColumnName("description");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .HasColumnName("image_url");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("'1'")
                .HasColumnName("is_active");
            entity.Property(e => e.Price)
                .HasPrecision(15, 2)
                .HasColumnName("price");
            entity.Property(e => e.StockQuantity)
                .HasDefaultValueSql("'0'")
                .HasColumnName("stock_quantity");
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("PRIMARY");

            entity.ToTable("brands");

            entity.HasIndex(e => e.BrandName, "brand_name").IsUnique();

            entity.Property(e => e.BrandId).HasColumnName("brand_id");
            entity.Property(e => e.BrandName)
                .HasMaxLength(50)
                .HasColumnName("brand_name");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PRIMARY");

            entity.ToTable("orders");

            entity.HasIndex(e => e.OrderCode, "order_code").IsUnique();

            entity.HasIndex(e => e.UserId, "user_id");

            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.OrderCode)
                .HasMaxLength(50)
                .HasColumnName("order_code");
            entity.Property(e => e.ShippingAddress)
                .HasColumnType("text")
                .HasColumnName("shipping_address");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValueSql("'pending'")
                .HasColumnName("status");
            entity.Property(e => e.TotalAmount)
                .HasPrecision(15, 2)
                .HasColumnName("total_amount");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("orders_ibfk_1");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("PRIMARY");

            entity.ToTable("order_items");

            entity.HasIndex(e => e.AccessoryId, "accessory_id");

            entity.HasIndex(e => e.OrderId, "order_id");

            entity.HasIndex(e => e.ProductId, "product_id");

            entity.Property(e => e.OrderItemId).HasColumnName("order_item_id");
            entity.Property(e => e.AccessoryId).HasColumnName("accessory_id");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.UnitPrice)
                .HasPrecision(15, 2)
                .HasColumnName("unit_price");

            entity.HasOne(d => d.Accessory).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.AccessoryId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("order_items_ibfk_3");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("order_items_ibfk_1");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("order_items_ibfk_2");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PRIMARY");

            entity.ToTable("payments");

            entity.HasIndex(e => e.OrderId, "order_id");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.Amount)
                .HasPrecision(15, 2)
                .HasColumnName("amount");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(50)
                .HasColumnName("payment_method");
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(50)
                .HasDefaultValueSql("'pending'")
                .HasColumnName("payment_status");
            entity.Property(e => e.TransactionCode)
                .HasMaxLength(100)
                .HasColumnName("transaction_code");

            entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("payments_ibfk_1");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PRIMARY");

            entity.ToTable("products");

            entity.HasIndex(e => e.BrandId, "brand_id");

            entity.HasIndex(e => e.ProductName, "idx_products_name");

            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.BrandId).HasColumnName("brand_id");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("'1'")
                .HasColumnName("is_active");
            entity.Property(e => e.Price)
                .HasPrecision(15, 2)
                .HasColumnName("price");
            entity.Property(e => e.ProductName)
                .HasMaxLength(200)
                .HasColumnName("product_name");
            entity.Property(e => e.ProductsImages)
                .HasMaxLength(255)
                .HasColumnName("products_images");
            entity.Property(e => e.StockQuantity)
                .HasDefaultValueSql("'0'")
                .HasColumnName("stock_quantity");

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .HasConstraintName("products_ibfk_1");
        });

        modelBuilder.Entity<ProductSpec>(entity =>
        {
            entity.HasKey(e => e.SpecId).HasName("PRIMARY");

            entity.ToTable("product_specs");

            entity.HasIndex(e => e.ProductId, "product_id").IsUnique();

            entity.Property(e => e.SpecId).HasColumnName("spec_id");
            entity.Property(e => e.Cpu)
                .HasMaxLength(100)
                .HasColumnName("cpu");
            entity.Property(e => e.Gpu)
                .HasMaxLength(100)
                .HasColumnName("gpu");
            entity.Property(e => e.Os)
                .HasMaxLength(50)
                .HasColumnName("os");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Ram)
                .HasMaxLength(50)
                .HasColumnName("ram");
            entity.Property(e => e.ScreenSize)
                .HasMaxLength(50)
                .HasColumnName("screen_size");
            entity.Property(e => e.Storage)
                .HasMaxLength(100)
                .HasColumnName("storage");

            entity.HasOne(d => d.Product).WithOne(p => p.ProductSpec)
                .HasForeignKey<ProductSpec>(d => d.ProductId)
                .HasConstraintName("product_specs_ibfk_1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .HasColumnName("full_name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .HasColumnName("phone");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValueSql("'customer'")
                .HasColumnName("role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
