(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const products = window.PRODUCTS || [];
  const productGrid = document.querySelector("#product-grid");
  const filters = document.querySelector("#filters");
  const modal = document.querySelector("#product-modal");
  const modalBody = document.querySelector("#modal-body");
  const closeModalButton = document.querySelector("#modal-close");
  const menuToggle = document.querySelector("#menu-toggle");
  const navLinks = document.querySelector("#nav-links");
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  const submitFrame = document.querySelector("#contact-submit-frame");
  const productField = document.querySelector("#product");
  let activeCategory = "All";
  let submitting = false;

  const money = (value) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 }).format(value);

  const imagePath = (product, filename) =>
    `assets/images/products/${encodeURIComponent(product.id)}/${encodeURIComponent(filename)}`;

  const minimumPrice = (product) => Math.min(...product.variants.map((variant) => variant.price));
  const maximumPrice = (product) => Math.max(...product.variants.map((variant) => variant.price));
  const priceLabel = (product) =>
    minimumPrice(product) === maximumPrice(product)
      ? money(minimumPrice(product))
      : `${money(minimumPrice(product))}–${money(maximumPrice(product))}`;

  function renderFilters() {
    if (!filters) return;
    const categories = ["All", ...new Set(products.map((product) => product.category))];
    filters.innerHTML = categories
      .map(
        (category) =>
          `<button class="filter-btn ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">${category}</button>`
      )
      .join("");

    filters.querySelectorAll("[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category;
        renderFilters();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    if (!productGrid) return;
    const visible = products.filter(
      (product) => activeCategory === "All" || product.category === activeCategory
    );
    productGrid.innerHTML = visible
      .map(
        (product) => `
          <article class="product-card">
            <div class="product-image-wrap">
              ${product.featured ? '<span class="badge">Featured</span>' : ""}
              <img src="${imagePath(product, product.images[0])}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-body">
              <span class="product-category">${product.category}</span>
              <h3>${product.name}</h3>
              <p class="product-short">${product.short}</p>
              <div class="product-price">${priceLabel(product)} CAD</div>
              <div class="product-actions">
                <button class="btn btn-outline" type="button" data-view-product="${product.id}">View details</button>
                <button class="btn btn-primary" type="button" data-message-product="${product.id}">Inquire by Message</button>
              </div>
            </div>
          </article>`
      )
      .join("");

    productGrid.querySelectorAll("[data-view-product]").forEach((button) => {
      button.addEventListener("click", () => openProduct(button.dataset.viewProduct));
    });
    productGrid.querySelectorAll("[data-message-product]").forEach((button) => {
      button.addEventListener("click", () => openTextMessage(button.dataset.messageProduct));
    });
  }

  function openProduct(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="gallery">
        <img class="gallery-main" id="gallery-main" src="${imagePath(product, product.images[0])}" alt="${product.name}">
        <div class="gallery-thumbs">
          ${product.images
            .map(
              (image, index) => `
                <button class="thumb ${index === 0 ? "active" : ""}" type="button" data-gallery-image="${image}" aria-label="View image ${index + 1}">
                  <img src="${imagePath(product, image)}" alt="">
                </button>`
            )
            .join("")}
        </div>
      </div>
      <div class="modal-details">
        <span class="product-category">${product.category}</span>
        <h2>${product.name}</h2>
        <p class="modal-description">${product.short}</p>
        <div class="modal-price" id="modal-price">${money(product.variants[0].price)} CAD</div>
        ${
          product.variants.length
            ? `<div class="variant-group">
                <label for="variant-select">Select option</label>
                <select class="variant-select" id="variant-select">
                  ${product.variants
                    .map((variant, index) => `<option value="${index}">${variant.label} — ${money(variant.price)} CAD</option>`)
                    .join("")}
                </select>
              </div>`
            : ""
        }
        <p class="availability">${product.availability}</p>
        <h3>Product details</h3>
        <ul class="feature-list">${product.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        <p><small>Cricket bats are natural willow products. Grains, colour, exact weight and appearance can vary between individual bats.</small></p>
        <div class="modal-actions">
          <button class="btn btn-primary" type="button" id="modal-message">Inquire by Message</button>
          <button class="btn btn-outline" type="button" id="modal-call">Call now</button>
        </div>
      </div>`;

    const mainImage = modalBody.querySelector("#gallery-main");
    modalBody.querySelectorAll("[data-gallery-image]").forEach((button) => {
      button.addEventListener("click", () => {
        mainImage.src = imagePath(product, button.dataset.galleryImage);
        modalBody.querySelectorAll(".thumb").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
      });
    });

    const variantSelect = modalBody.querySelector("#variant-select");
    const modalPrice = modalBody.querySelector("#modal-price");
    variantSelect?.addEventListener("change", () => {
      modalPrice.textContent = `${money(product.variants[Number(variantSelect.value)].price)} CAD`;
    });

    modalBody.querySelector("#modal-message")?.addEventListener("click", () => {
      const variantIndex = variantSelect ? Number(variantSelect.value) : 0;
      openTextMessage(product.id, variantIndex);
    });

    modalBody.querySelector("#modal-call")?.addEventListener("click", () => {
      window.location.href = `tel:+${config.phoneNumber}`;
    });

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeModalButton?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function openTextMessage(productId, variantIndex = 0) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const variant = product.variants[variantIndex] || product.variants[0];
    const message = [
      `Hi ${config.businessName || "Cricket Hub Canada"},`,
      `I am interested in ${product.name}${variant ? ` (${variant.label})` : ""} listed at ${money(variant.price)} CAD.`,
      "Please confirm current availability, exact photos/weight if applicable, and pickup or shipping options."
    ].join("\n");
    window.location.href = `sms:+${config.phoneNumber}?body=${encodeURIComponent(message)}`;
  }

  function prefillProductInquiry(product, variant) {
    if (productField) {
      productField.value = `${product.name}${variant ? ` — ${variant.label} (${money(variant.price)} CAD)` : ""}`;
    }
    const typeField = document.querySelector("#inquiry-type");
    if (typeField) typeField.value = "Product inquiry";
    const messageField = document.querySelector("#message");
    if (messageField) {
      messageField.value = `I am interested in ${product.name}${variant ? ` (${variant.label})` : ""}. Please confirm availability and next steps.`;
    }
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.querySelector("#name")?.focus(), 500);
  }

  function configureContactDetails() {
    document.querySelectorAll("[data-phone]").forEach((element) => {
      element.textContent = config.phoneDisplay || "";
    });
    document.querySelectorAll("[data-phone-link]").forEach((element) => {
      element.href = `tel:+${config.phoneNumber}`;
    });
    document.querySelectorAll("[data-email]").forEach((element) => {
      element.textContent = config.publicEmail || "Email through the contact form";
    });
    document.querySelectorAll("[data-email-link]").forEach((element) => {
      if (config.publicEmail) element.href = `mailto:${config.publicEmail}`;
    });
    document.querySelectorAll("[data-location]").forEach((element) => {
      element.textContent = config.location || "Kingston, Ontario";
    });
    document.querySelectorAll("[data-instagram]").forEach((element) => {
      if (config.instagramUrl) {
        element.href = config.instagramUrl;
      } else {
        element.hidden = true;
      }
    });
  }

  function configureContactForm() {
    if (!contactForm) return;
    const pageUrl = contactForm.querySelector('[name="page_url"]');
    if (pageUrl) pageUrl.value = window.location.href;

    contactForm.addEventListener("submit", (event) => {
      const endpoint = String(config.contactFormEndpoint || "").trim();
      if (endpoint && endpoint.startsWith("https://script.google.com/")) {
        contactForm.action = endpoint;
        submitting = true;
        if (formStatus) {
          formStatus.className = "form-status";
          formStatus.textContent = "Sending your message…";
        }
        return;
      }

      event.preventDefault();
      const formData = new FormData(contactForm);
      const subject = `[Cricket Hub Canada] ${formData.get("inquiry_type") || "Website inquiry"}`;
      const body = [
        `Name: ${formData.get("name") || ""}`,
        `Email: ${formData.get("email") || ""}`,
        `Phone: ${formData.get("phone") || ""}`,
        `City: ${formData.get("city") || ""}`,
        `Product: ${formData.get("product") || ""}`,
        "",
        String(formData.get("message") || "")
      ].join("\n");
      if (formStatus) {
        formStatus.className = "form-status warning";
        formStatus.textContent = "The direct form backend is not connected yet. Your email app will open with the message prepared.";
      }
      if (config.publicEmail) {
        window.location.href = `mailto:${config.publicEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    });

    submitFrame?.addEventListener("load", () => {
      if (!submitting) return;
      submitting = false;
      contactForm.reset();
      if (formStatus) {
        formStatus.className = "form-status success";
        formStatus.textContent = "Thank you. Your message was sent successfully.";
      }
    });
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });
  navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => navLinks.classList.remove("open")));
  closeModalButton?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("open")) closeModal();
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
  renderFilters();
  renderProducts();
  configureContactDetails();
  configureContactForm();
})();
