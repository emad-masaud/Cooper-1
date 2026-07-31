  const t = (window as any).__meamartTranslations || {};
  const isAr = window.location.pathname.startsWith("/ar");
  let form = document.getElementById("create-ad-form") as HTMLFormElement;
  let statusDiv = document.getElementById("form-status") as HTMLDivElement;
  const getCookie = (_name: string) => null;

  // ─── Styled Category Selector Logic ──────────────────────────────────────
  const parentCards = document.querySelectorAll(".parent-category-card");
  const subContainer = document.getElementById("subcategories-container");
  const subGrid = document.getElementById("subcategories-grid");
  const realSelect = document.getElementById("real-category-select") as HTMLSelectElement;

  parentCards.forEach((card) => {
    card.addEventListener("click", () => {
      const parentKey = card.getAttribute("data-category");
      if (!parentKey) return;

      // Highlight active parent card
      parentCards.forEach((c) => {
        c.classList.remove("border-primary", "bg-primary/5", "scale-[1.02]", "ring-2", "ring-primary/20");
        c.querySelector(".icon-container")?.classList.remove("bg-primary", "text-white");
      });
      card.classList.add("border-primary", "bg-primary/5", "scale-[1.02]", "ring-2", "ring-primary/20");
      
      const iconWrap = card.querySelector(".icon-container");
      if (iconWrap) {
        iconWrap.classList.add("bg-primary", "text-white");
      }

      // Populate subcategories
      if (subGrid && subContainer && realSelect) {
        subGrid.innerHTML = "";
        const optgroup = realSelect.querySelector(`optgroup[data-parent="${parentKey}"]`);
        if (optgroup) {
          const options = optgroup.querySelectorAll("option");
          options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "subcategory-btn px-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-primary/45 hover:bg-primary/5 hover:text-primary transition-all text-center cursor-pointer";
            btn.textContent = opt.textContent;
            btn.setAttribute("data-value", opt.value);

            btn.addEventListener("click", () => {
              subGrid.querySelectorAll(".subcategory-btn").forEach((b) => {
                b.classList.remove("border-primary", "bg-primary/10", "text-primary");
              });
              btn.classList.add("border-primary", "bg-primary/10", "text-primary");

              realSelect.value = opt.value;
              realSelect.dispatchEvent(new Event("change"));
            });

            subGrid.appendChild(btn);
          });
          subContainer.classList.remove("hidden");
        }
      }
    });
  });

  // ─── Advertiser Role Selector Logic ──────────────────────────────────────
  const roleCards = document.querySelectorAll(".role-card");
  const inlineProductFormContainer = document.getElementById("inline-product-form-container");
  const addToCatalogCheckbox = document.getElementById("add-to-catalog-checkbox") as HTMLInputElement;
  const inlineProductFields = document.getElementById("inline-product-fields");

  roleCards.forEach((card) => {
    const radio = card.querySelector('input[type="radio"]') as HTMLInputElement;
    card.addEventListener("click", () => {
      // Uncheck other radios and cards
      roleCards.forEach((c) => {
        c.classList.remove("border-primary", "bg-primary/5", "ring-2", "ring-primary/20");
        c.classList.add("border-zinc-200", "dark:border-zinc-800", "bg-white", "dark:bg-zinc-950/40");
        const dot = c.querySelector(".dot");
        if (dot) {
          dot.classList.remove("bg-primary");
          dot.classList.add("bg-transparent");
        }
      });

      // Highlight active card
      card.classList.add("border-primary", "bg-primary/5", "ring-2", "ring-primary/20");
      card.classList.remove("border-zinc-200", "dark:border-zinc-800", "bg-white", "dark:bg-zinc-950/40");
      if (radio) {
        radio.checked = true;
      }
      const activeDot = card.querySelector(".dot");
      if (activeDot) {
        activeDot.classList.add("bg-primary");
        activeDot.classList.remove("bg-transparent");
      }

      // Show/hide inline product form container
      if (radio && radio.value === "company") {
        inlineProductFormContainer?.classList.remove("hidden");
      } else {
        inlineProductFormContainer?.classList.add("hidden");
      }
    });
  });

  addToCatalogCheckbox?.addEventListener("change", () => {
    if (addToCatalogCheckbox.checked) {
      inlineProductFields?.classList.remove("hidden");
    } else {
      inlineProductFields?.classList.add("hidden");
    }
  });

  const offersDeliveryCheckbox = document.getElementById("offers-delivery-checkbox") as HTMLInputElement;
  const deliveryConfigFields = document.getElementById("delivery-config-fields");

  offersDeliveryCheckbox?.addEventListener("change", () => {
    if (offersDeliveryCheckbox.checked) {
      deliveryConfigFields?.classList.remove("hidden");
    } else {
      deliveryConfigFields?.classList.add("hidden");
    }
  });

  function selectCategoryUI(subKey: string) {
    console.log("selectCategoryUI called with:", subKey);
    if (!realSelect) {
      console.warn("realSelect element not found!");
      return;
    }

    // Map AI Intents to parent keys
    const intentMap: Record<string, string> = {
      'SELL_CAR': 'cars',
      'SELL_PROPERTY': 'real-estate',
      'SELL_DEVICE': 'electronics',
      'POST_JOB': 'jobs',
      'POST_SERVICE': 'services'
    };
    
    let targetKey = intentMap[subKey] || subKey;
    let option = realSelect.querySelector(`option[value="${targetKey}"]`);
    let parentKey = null;

    if (option) {
      parentKey = option.getAttribute("data-parent");
    } else {
      // It might be a parent key or fuzzy match
      const optgroup = realSelect.querySelector(`optgroup[data-parent="${targetKey}"]`);
      if (optgroup) {
        parentKey = targetKey;
      } else {
        // Fuzzy text match
        const allGroups = Array.from(realSelect.querySelectorAll("optgroup"));
        for (const g of allGroups) {
          if (g.label.includes(targetKey)) {
            parentKey = g.getAttribute("data-parent");
            break;
          }
        }
      }
    }

    if (!parentKey) {
      console.warn(`Category mapping for "${targetKey}" not found in realSelect!`);
      return;
    }

    console.log("Found parentKey:", parentKey);
    const parentCard = document.querySelector(`.parent-category-card[data-category="${parentKey}"]`) as HTMLButtonElement | null;
    if (parentCard) {
      console.log("Clicking parentCard for:", parentKey);
      parentCard.click();
      
      // If we also had a specific subcategory option, select it
      if (option) {
        setTimeout(() => {
          const subBtn = document.querySelector(`.subcategory-btn[data-value="${targetKey}"]`) as HTMLButtonElement | null;
          if (subBtn) {
            console.log("Clicking subcategory button for:", targetKey);
            subBtn.click();
          } else {
            console.warn("subcategory button not found, falling back to direct select value!");
            realSelect.value = targetKey;
            realSelect.dispatchEvent(new Event("change"));
          }
        }, 100);
      }
    } else {
      console.warn("parentCard not found for key:", parentKey);
    }
  }

  // ─── Step Wizard Logic ──────────────────────────────────────────────────
  let selectedFiles: File[] = [];
  let currentStep = 1;
  const totalSteps = 6;
  const stepsConfig: Record<number, string[]> = {
    1: ["smart-fill-container", "section-role-selection", "section-additional", "section-custom-fields"],
    2: ["section-main-fields"],
    3: ["section-price-catalog"],
    4: ["section-location"],
    5: ["section-media"],
    6: ["section-description", "section-publish"],
  };

  function showStep(step: number) {
    // Hide all steps
    Object.values(stepsConfig).forEach((ids) => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
      });
    });

    // Show current step
    stepsConfig[step].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove("hidden");
    });

    // Update Stepper indicators
    document.querySelectorAll(".step-indicator").forEach((indicator) => {
      const s = Number(indicator.getAttribute("data-step"));
      const span = indicator.querySelector("span");
      if (s === step) {
        indicator.classList.add("text-primary");
        indicator.classList.remove("text-zinc-500", "text-emerald-600");
        if (span) {
          span.className =
            "w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px]";
        }
      } else if (s < step) {
        // Completed step
        indicator.classList.remove("text-primary", "text-zinc-500");
        indicator.classList.add("text-emerald-600");
        if (span) {
          span.className =
            "w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]";
        }
      } else {
        // Future step
        indicator.classList.remove("text-primary", "text-emerald-600");
        indicator.classList.add("text-zinc-500");
        if (span) {
          span.className =
            "w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 flex items-center justify-center text-[10px]";
        }
      }
    });

    // Update Progress Bar
    const progressPercent = (step / totalSteps) * 100;
    const progressBar = document.getElementById("step-progress-bar");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    // Update Mobile text
    const mobileTextMap: Record<number, string> = {
      1: t["gen.isar.create.9"],
      2: t["gen.isar.create.10"],
      3: t["gen.isar.create.11"],
      4: t["gen.isar.create.12"],
      5: t["gen.isar.create.13"],
      6: t["gen.isar.create.14"],
    };
    const mobileText = document.getElementById("step-mobile-label");
    if (mobileText) mobileText.textContent = mobileTextMap[step];

    // Update step counters
    const desktopCounter = document.getElementById("desktop-step-counter");
    const mobileCounter = document.getElementById("mobile-step-counter");
    const stepCountText = (
      t["gen.isar.create.15"] || "الخطوة {step} من {totalSteps}"
    )
      .replace("${step}", String(step))
      .replace("${totalSteps}", String(totalSteps))
      .replace("{step}", String(step))
      .replace("{totalSteps}", String(totalSteps));
    if (desktopCounter) desktopCounter.textContent = stepCountText;
    if (mobileCounter) mobileCounter.textContent = stepCountText;

    // Navigation buttons state
    const prevBtn = document.getElementById("prev-step-btn");
    const nextBtn = document.getElementById("next-step-btn");
    const prevBtnMobile = document.getElementById("prev-step-btn-mobile");
    const nextBtnMobile = document.getElementById("next-step-btn-mobile");
    const submitBtnMobile = document.getElementById("submit-btn-mobile");

    // Previous buttons
    if (step === 1) {
      if (prevBtn) prevBtn.classList.add("hidden");
      if (prevBtnMobile) prevBtnMobile.classList.add("hidden");
    } else {
      if (prevBtn) prevBtn.classList.remove("hidden");
      if (prevBtnMobile) prevBtnMobile.classList.remove("hidden");
    }

    // Next / Submit buttons
    if (step === totalSteps) {
      if (nextBtn) nextBtn.classList.add("hidden");
      if (nextBtnMobile) nextBtnMobile.classList.add("hidden");
      if (submitBtnMobile) submitBtnMobile.classList.remove("hidden");
    } else {
      if (nextBtn) nextBtn.classList.remove("hidden");
      if (nextBtnMobile) nextBtnMobile.classList.remove("hidden");
      if (submitBtnMobile) submitBtnMobile.classList.add("hidden");
    }

    // Trigger map resize if moving to Step 4 (Location)
    if (step === 4) {
      setTimeout(() => {
        const gMap = (window as any).googleMap;
        const gMarker = (window as any).googleMarker;
        if (gMap && (window as any).google?.maps?.event) {
          (window as any).google.maps.event.trigger(gMap, "resize");
          if (gMarker && gMarker.getPosition) {
            gMap.setCenter(gMarker.getPosition());
          }
        }
        const lMap = (window as any).leafletMap;
        const lMarker = (window as any).leafletMarker;
        if (lMap && typeof lMap.invalidateSize === "function") {
          lMap.invalidateSize();
          if (lMarker && lMarker.getLatLng) {
            lMap.setView(lMarker.getLatLng(), lMap.getZoom() || 14);
          }
        }
      }, 150);
    }

    // Auto-scroll to top of stepper to keep context
    const stepper = document.getElementById("create-ad-stepper");
    if (stepper) stepper.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function validateCurrentStep() {
    const activeSectionIds = stepsConfig[currentStep];
    let stepValid = true;

    activeSectionIds.forEach((id: string) => {
      const section = document.getElementById(id);
      if (!section) return;

      const inputs = section.querySelectorAll(
        "input[required], select[required], textarea[required]",
      );
      inputs.forEach((input) => {
        const inputEl = input as HTMLInputElement;

        // Custom phone validation handle
        if (inputEl.name.endsWith("_number")) {
          const val = inputEl.value.trim();
          if (!val) {
            stepValid = false;
            inputEl.classList.add("border-red-500");
          } else {
            inputEl.classList.remove("border-red-500");
          }
          return;
        }

        if (!inputEl.checkValidity()) {
          stepValid = false;
          inputEl.classList.add("border-red-500");
          form.classList.add("was-validated");
        } else {
          inputEl.classList.remove("border-red-500");
        }
      });
    });

    // Special check for images in step 5
    if (currentStep === 5) {
      const noImageChecked = document.getElementById(
        "no-image-checkbox",
      ) as HTMLInputElement;
      const uploadedFiles = (window as any).selectedAdFiles || [];
      if (
        uploadedFiles.length === 0 &&
        (!noImageChecked || !noImageChecked.checked)
      ) {
        alert(t["gen.isar.create.16"]);
        stepValid = false;
      }
    }

    return stepValid;
  }

  // Bind navigation buttons
  document.getElementById("next-step-btn")?.addEventListener("click", () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });

  document
    .getElementById("next-step-btn-mobile")
    ?.addEventListener("click", () => {
      if (validateCurrentStep() && currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
      }
    });

  document.getElementById("prev-step-btn")?.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  document
    .getElementById("prev-step-btn-mobile")
    ?.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });

  // Handle mobile submit button click by triggering standard form submit
  document
    .getElementById("submit-btn-mobile")
    ?.addEventListener("click", () => {
      if (validateCurrentStep()) {
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });

  // Make indicators clickable to navigate back to completed steps
  document.querySelectorAll(".step-indicator").forEach((indicator) => {
    indicator.addEventListener("click", () => {
      const targetStep = Number(indicator.getAttribute("data-step"));
      if (targetStep < currentStep) {
        currentStep = targetStep;
        showStep(currentStep);
      } else if (targetStep > currentStep) {
        // Only allow moving forward if current step is valid
        if (validateCurrentStep()) {
          if (targetStep === currentStep + 1) {
            currentStep = targetStep;
            showStep(currentStep);
          }
        }
      }
    });
  });

  function langValue(arValue: string, enValue: string) {
    if (isAr) return arValue;
    return enValue;
  }

  // Helper function to prefill form fields from AI Agent data
  function prefillFormFields(prefillData: any) {
    if (!prefillData || !form) return;

    // Prefill delivery info from AI
    if (prefillData.deliveryInfo) {
      const info = prefillData.deliveryInfo;
      const offersDeliveryCheckbox = document.getElementById("offers-delivery-checkbox") as HTMLInputElement;
      if (offersDeliveryCheckbox) {
        offersDeliveryCheckbox.checked = Boolean(info.offersDelivery);
        offersDeliveryCheckbox.dispatchEvent(new Event("change"));
      }

      if (info.scope) {
        const scopeSelect = document.getElementById("delivery-scope-select") as HTMLSelectElement;
        if (scopeSelect) scopeSelect.value = info.scope;
      }

      if (info.vehicleType) {
        const vehicleInput = document.getElementById("delivery-vehicle-input") as HTMLInputElement;
        if (vehicleInput) vehicleInput.value = info.vehicleType;
      }

      if (Array.isArray(info.coverageCities) && info.coverageCities.length > 0) {
        const citiesInput = document.getElementById("delivery-cities-input") as HTMLInputElement;
        if (citiesInput) citiesInput.value = info.coverageCities.join(", ");
      }

      // Check delivery types checkboxes
      if (Array.isArray(info.deliveryType)) {
        document.querySelectorAll('input[name="delivery_type"]').forEach((el: any) => {
          el.checked = info.deliveryType.includes(el.value);
        });
      }

      // Check additional features checkboxes
      if (Array.isArray(info.additionalFeatures)) {
        document.querySelectorAll('input[name="delivery_features"]').forEach((el: any) => {
          el.checked = info.additionalFeatures.includes(el.value);
        });
      }
    }

    // Prefill inline catalog fields if company
    if (prefillData.title) {
      const prodName = document.getElementById("prod-name-input") as HTMLInputElement;
      if (prodName) prodName.value = prefillData.title;

      const prodSku = document.getElementById("prod-sku-input") as HTMLInputElement;
      if (prodSku) {
        const cleanTitle = prefillData.title.replace(/[^\w\s]/g, '').trim().split(/\s+/).slice(0, 3).join('-').toUpperCase();
        prodSku.value = cleanTitle || "PRODUCT-" + Math.floor(Math.random() * 10000);
      }
    }
    if (prefillData.description) {
      const prodDesc = document.getElementById("prod-desc-input") as HTMLTextAreaElement;
      if (prodDesc) prodDesc.value = prefillData.description;
    }
    if (prefillData.price) {
      const prodPrice = document.getElementById("prod-price-input") as HTMLInputElement;
      if (prodPrice) prodPrice.value = String(prefillData.price);
    }
    if (prefillData.brand) {
      const prodBrand = document.getElementById("prod-brand-input") as HTMLInputElement;
      if (prodBrand) prodBrand.value = prefillData.brand;
    }

    if (prefillData.title) {
      const titleInput = form.querySelector(
        'input[name="listing_title"]',
      ) as HTMLInputElement;
      if (titleInput) {
        titleInput.value = prefillData.title;
        titleInput.dispatchEvent(new Event("input"));
      }
    }
    if (prefillData.description) {
      const descInput = form.querySelector(
        'textarea[name="listing_description"]',
      ) as HTMLTextAreaElement;
      if (descInput) {
        descInput.value = prefillData.description;
        descInput.dispatchEvent(new Event("input"));
      }
    }
    if (prefillData.price) {
      const priceInput = document.getElementById(
        "price-input",
      ) as HTMLInputElement;
      if (priceInput) {
        priceInput.value = String(prefillData.price);
        priceInput.dispatchEvent(new Event("input"));
      }
    }
    if (prefillData.contact_name) {
      const contactNameInput = form.querySelector('[name="contact_name"]') as HTMLInputElement;
      if (contactNameInput) {
        contactNameInput.value = prefillData.contact_name;
        contactNameInput.dispatchEvent(new Event("input"));
      }
    }
    if (prefillData.contact_whatsapp) {
      const waInput = form.querySelector('[name="contact_whatsapp_number"]') as HTMLInputElement;
      if (waInput) {
        let cleanWA = String(prefillData.contact_whatsapp).replace(/\s+/g, '');
        if (cleanWA.startsWith('+966')) cleanWA = cleanWA.substring(4);
        else if (cleanWA.startsWith('00966')) cleanWA = cleanWA.substring(5);
        else if (cleanWA.startsWith('966')) cleanWA = cleanWA.substring(3);
        waInput.value = cleanWA;
        waInput.dispatchEvent(new Event("input"));
      }
    }
    const catVal = prefillData.categoryKey || prefillData.category;
    if (catVal) {
      selectCategoryUI(catVal);
    }

    if (prefillData.city) {
      const cityInput = document.getElementById("city-input") as HTMLInputElement;
      if (cityInput) {
        cityInput.value = prefillData.city;
        cityInput.dispatchEvent(new Event("input"));
        cityInput.dispatchEvent(new Event("change"));
      }
    }
    if (prefillData.district) {
      const districtInput = document.getElementById("district-input") as HTMLInputElement;
      if (districtInput) {
        districtInput.value = prefillData.district;
        districtInput.dispatchEvent(new Event("input"));
        districtInput.dispatchEvent(new Event("change"));
      }
    }

    setTimeout(() => {
      const attributes = prefillData.attributes || prefillData.customFields || {};
      // Also extract any root keys that start with custom_field_
      Object.keys(prefillData).forEach(key => {
        if (key.startsWith('custom_field_') || key.startsWith('custom_')) {
          attributes[key] = prefillData[key];
        }
      });
      
      Object.entries(attributes).forEach(([aiKey, aiVal]) => {
        if (aiVal === null || aiVal === undefined || aiVal === "") return;

        // 1. Direct name match check
        const directEl = form.querySelector(`[name="custom_field_${aiKey}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
        if (directEl) {
          if (directEl.type === "checkbox") {
            const checkedVal = String(aiVal).toLowerCase();
            (directEl as HTMLInputElement).checked = checkedVal === "true" || checkedVal === "1" || checkedVal === "نعم" || checkedVal === "yes";
          } else {
            directEl.value = String(aiVal);
          }
          directEl.dispatchEvent(new Event("input", { bubbles: true }));
          directEl.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }

        // 2. Loose label/name matching
        const cleanAiKey = aiKey.trim().toLowerCase();
        const inputs = customFieldsContainer?.querySelectorAll("input, select, textarea") || [];
        let matched = false;
        for (const input of inputs) {
          const label = input.getAttribute("data-field-label")?.trim().toLowerCase() || "";
          const name = input.getAttribute("name")?.replace("custom_field_", "").toLowerCase() || "";
          if (
            cleanAiKey.includes(label) ||
            label.includes(cleanAiKey) ||
            cleanAiKey.includes(name) ||
            name.includes(cleanAiKey)
          ) {
            const inputEl = input as HTMLInputElement;
            if (inputEl.type === "checkbox") {
              const checkedVal = String(aiVal).toLowerCase();
              inputEl.checked = checkedVal === "true" || checkedVal === "1" || checkedVal === "نعم" || checkedVal === "yes";
            } else {
              if (inputEl.type === "number") {
                const numericVal = String(aiVal).replace(/[^\d.]/g, "");
                inputEl.value = numericVal;
              } else {
                inputEl.value = String(aiVal);
              }
            }
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));
            inputEl.dispatchEvent(new Event("change", { bubbles: true }));
            matched = true;
            break;
          }
        }
        
        // 3. If not matched, auto-add as a dynamic custom field
        if (!matched) {
          let attrName = aiKey.replace('custom_field_', '').replace('custom_', '').replace(/_/g, ' ');
          attrName = attrName.charAt(0).toUpperCase() + attrName.slice(1);
          if (typeof addCustomFieldDirectly === "function") {
             addCustomFieldDirectly(aiKey, attrName, String(aiVal));
          }
        }
      });
    }, 200);

    // Scroll to top of stepper to keep context
    // Check Advertiser Role from AI JSON (is_company, advertiser_role)
    const isCompanyRole = String(prefillData.advertiser_role).toLowerCase() === 'company' || 
                          String(prefillData.is_company).toLowerCase() === 'true' || 
                          prefillData.is_company === true;
    if (isCompanyRole) {
      const companyCard = document.querySelector('.role-card input[value="company"]')?.closest('.role-card') as HTMLDivElement;
      if (companyCard) companyCard.click();
    } else {
      const indCard = document.querySelector('.role-card input[value="individual"]')?.closest('.role-card') as HTMLDivElement;
      if (indCard) indCard.click();
    }

    // Scroll to top of stepper to keep context
    const stepper = document.getElementById("create-ad-stepper");
    if (stepper) {
      stepper.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Attempt to jump to Step 5 (Media/Photos)
    currentStep = 1;
    let targetStep = 5;
    for(let s = 1; s < targetStep; s++) {
      currentStep = s;
      showStep(currentStep);
      if (!validateCurrentStep()) {
        break; // Stop at the first invalid step so user can fix it
      }
    }
    // If we passed all intermediate steps successfully, make the jump
    if (currentStep === targetStep - 1 && validateCurrentStep()) {
       currentStep = targetStep;
       showStep(currentStep);
    }

    console.log("Ad fields prefilled successfully! Advanced to step:", currentStep);
  }

  // 1. Listen for dynamic agent updates
  window.addEventListener("meamart:prefill", (e: any) => {
    catalogDataPromise.then(() => {
      prefillFormFields(e.detail);
    });
  });

  // 2. Check for initial prefill data from Intent Workflow session storage
  try {
    const prefillDataStr = sessionStorage.getItem("meamart_prefill_ad");
    if (prefillDataStr) {
      const prefillData = JSON.parse(prefillDataStr);
      catalogDataPromise.then(() => {
        prefillFormFields(prefillData);
      });
      sessionStorage.removeItem("meamart_prefill_ad");
    }
  } catch (e) {
    console.error("Failed to parse prefill data from storage:", e);
  }

  // Session is validated server-side in the frontmatter — no client-side check needed

  // AI Ad Assistant (Personal Account Manager) JavaScript
  const triggerAiBtn = document.getElementById(
    "trigger-ai-btn",
  ) as HTMLButtonElement;
  const aiChatModal = document.getElementById(
    "ai-chat-modal",
  ) as HTMLDivElement;
  const closeAiChatBtn = document.getElementById(
    "close-ai-chat-btn",
  ) as HTMLButtonElement;
  const aiChatModalOverlay = document.getElementById(
    "ai-chat-modal-overlay",
  ) as HTMLDivElement;

  const aiPromptInput = document.getElementById(
    "ai-prompt-input-modal",
  ) as HTMLInputElement;
  const generateAiBtn = document.getElementById(
    "generate-ai-btn-modal",
  ) as HTMLButtonElement;

  const aiChatLog = document.getElementById("ai-chat-log") as HTMLDivElement;
  const aiDashboard = document.getElementById("ai-dashboard") as HTMLDivElement;
  const aiBlockersList = document.getElementById(
    "ai-blockers-list",
  ) as HTMLDivElement;
  const aiOptimizersList = document.getElementById(
    "ai-optimizers-list",
  ) as HTMLDivElement;
  const aiCustomFieldsPanel = document.getElementById(
    "ai-custom-fields-panel",
  ) as HTMLDivElement;
  const aiCustomFieldsList = document.getElementById(
    "ai-custom-fields-list",
  ) as HTMLDivElement;
  const applyAiUpdatesBtn = document.getElementById(
    "apply-ai-updates-btn",
  ) as HTMLButtonElement;
  const aiGoalBadge = document.getElementById(
    "ai-goal-badge",
  ) as HTMLSpanElement;
  const aiReviewPanel = document.getElementById(
    "ai-review-panel",
  ) as HTMLDivElement;
  const aiReviewItems = document.getElementById(
    "ai-review-items",
  ) as HTMLDivElement;

  // Voice & File Elements inside modal
  const aiMicBtn = document.getElementById(
    "ai-mic-btn-modal",
  ) as HTMLButtonElement;
  const aiFileUploadBtn = document.getElementById(
    "ai-file-upload-btn-modal",
  ) as HTMLButtonElement;
  const aiFileInput = document.getElementById(
    "ai-file-input-modal",
  ) as HTMLInputElement;
  const aiFileBadge = document.getElementById(
    "ai-file-badge-modal",
  ) as HTMLDivElement;
  const aiFileName = document.getElementById(
    "ai-file-name-modal",
  ) as HTMLSpanElement;
  const aiRemoveFileBtn = document.getElementById(
    "ai-remove-file-btn-modal",
  ) as HTMLButtonElement;

  let fileContext = "";
  let isRecording = false;
  let recognition: any = null;

  // Speech Recognition API
  if (typeof window !== "undefined") {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = t["gen.isar.create.18"];

      recognition.onstart = () => {
        isRecording = true;
        if (aiMicBtn)
          aiMicBtn.classList.add("bg-red-500", "text-white", "animate-pulse");
      };

      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (aiPromptInput) {
          aiPromptInput.value = aiPromptInput.value
            ? aiPromptInput.value + " " + text
            : text;
        }
      };

      recognition.onerror = () => {
        isRecording = false;
        if (aiMicBtn)
          aiMicBtn.classList.remove(
            "bg-red-500",
            "text-white",
            "animate-pulse",
          );
      };

      recognition.onend = () => {
        isRecording = false;
        if (aiMicBtn)
          aiMicBtn.classList.remove(
            "bg-red-500",
            "text-white",
            "animate-pulse",
          );
      };
    }
  }

  aiMicBtn?.addEventListener("click", () => {
    if (!recognition) {
      alert(t["gen.isar.create.19"]);
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  aiFileUploadBtn?.addEventListener("click", () => aiFileInput?.click());

  aiFileInput?.addEventListener("change", () => {
    const file = aiFileInput.files?.[0];
    if (!file) return;

    if (aiFileName) aiFileName.textContent = `📎 ${file.name}`;
    aiFileBadge?.classList.remove("hidden");

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      fileContext = typeof content === "string" ? content.slice(0, 5000) : "";
      triggerSilentInference();
    };
    reader.readAsText(file);
  });

  aiRemoveFileBtn?.addEventListener("click", () => {
    fileContext = "";
    if (aiFileInput) aiFileInput.value = "";
    aiFileBadge?.classList.add("hidden");
    triggerSilentInference();
  });

  // Assistant State
  let assistantState = {
    goal: "",
    listingType: "",
    knownData: {},
    inferredData: {},
    missingBlockers: [] as string[],
    missingOptimizers: [] as string[],
    suggestedCustomFields: [] as any[],
    recommendedFieldUpdates: null as any,
  };

  function appendChatMessage(sender: "assistant" | "user", text: string) {
    if (!aiChatLog) return;
    const msg = document.createElement("div");
    msg.className =
      sender === "assistant"
        ? "p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary font-semibold border-l-2 border-primary"
        : "p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-end font-medium self-end";

    // Split message by lines to support formatting
    msg.innerHTML = text
      .split("\n")
      .map((line) => `<div>${line.trim()}</div>`)
      .join("");
    aiChatLog.appendChild(msg);
    aiChatLog.scrollTop = aiChatLog.scrollHeight;
  }

  function getCleanFieldName(key: string): string {
    const namesAr: Record<string, string> = {
      title: "العنوان",
      description: "وصف الإعلان",
      price: "السعر",
      categoryKey: "التصنيف",
      city: "المدينة",
      district: "الحي",
      street: "الشارع",
      contact_phone: "رقم الاتصال",
      contact_whatsapp: "رقم الواتساب",
      image: "الصورة الشخصية أو صورة المنتج",
      videoUrl: "رابط الفيديو",
    };
    const namesEn: Record<string, string> = {
      title: "Title",
      description: "Description",
      price: "Price",
      categoryKey: "Category",
      city: "City",
      district: "District",
      street: "Street",
      contact_phone: "Contact Phone",
      contact_whatsapp: "WhatsApp Number",
      image: "Image",
      videoUrl: "Video URL",
    };
    return isAr ? namesAr[key] || key : namesEn[key] || key;
  }

  function updateAssistantDashboard(data: any) {
    if (!aiDashboard) return;

    assistantState.goal = data.goal || data.intent || "";
    assistantState.listingType = data.listingType || data.intent || "";
    assistantState.missingBlockers = Array.isArray(data.missing_required)
      ? data.missing_required
      : Array.isArray(data.missingBlockers)
        ? data.missingBlockers
        : data.missing_required
          ? [data.missing_required]
          : [];
    assistantState.missingOptimizers = Array.isArray(data.missing_recommended)
      ? data.missing_recommended
      : Array.isArray(data.missingOptimizers)
        ? data.missingOptimizers
        : data.missing_recommended
          ? [data.missing_recommended]
          : [];
    assistantState.suggestedCustomFields = Array.isArray(
      data.suggestedCustomFields,
    )
      ? data.suggestedCustomFields
      : [];

    let updates = data.recommendedFieldUpdates || {};
    if (data.knownData) {
      updates = {
        ...data.knownData,
        contactMethod: data.knownData.contact_method,
        videoUrl: data.knownData.videoUrl,
        listing_condition: data.knownData.listing_condition,
      };
    }
    assistantState.recommendedFieldUpdates = updates;

    // Goal Badge
    if (aiGoalBadge && data.goal) {
      aiGoalBadge.textContent = data.goal;
      aiGoalBadge.classList.remove("hidden");
    }
    // Show dashboard if we have missing fields or recommendations
    const hasBlockers = assistantState.missingBlockers.length > 0;
    const hasOptimizers = assistantState.missingOptimizers.length > 0;
    const hasCustomFields = assistantState.suggestedCustomFields.length > 0;

    if (hasBlockers || hasOptimizers || hasCustomFields) {
      aiDashboard.classList.remove("hidden");
    } else {
      aiDashboard.classList.add("hidden");
    }

    // Render blockers
    if (aiBlockersList) {
      aiBlockersList.innerHTML = hasBlockers
        ? assistantState.missingBlockers
            .map(
              (b) =>
                `<span class="bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold">${getCleanFieldName(b)}</span>`,
            )
            .join(" ")
        : `<span class="text-zinc-400 font-semibold">${t["gen.isar.create.20"]}</span>`;
    }

    // Render optimizers
    if (aiOptimizersList) {
      aiOptimizersList.innerHTML = hasOptimizers
        ? assistantState.missingOptimizers
            .map(
              (o) =>
                `<span class="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-bold">${getCleanFieldName(o)}</span>`,
            )
            .join(" ")
        : `<span class="text-zinc-400 font-semibold">${t["gen.isar.create.21"]}</span>`;
    }

    // Render custom fields
    if (aiCustomFieldsPanel && aiCustomFieldsList) {
      if (hasCustomFields) {
        aiCustomFieldsPanel.classList.remove("hidden");
        aiCustomFieldsList.innerHTML = assistantState.suggestedCustomFields
          .map(
            (cf) => `
          <button type="button" class="quick-add-custom-field-btn bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1" data-key="${cf.key}" data-label="${cf.label}">
            <span>+ ${cf.label}</span>
          </button>
        `,
          )
          .join("");

        aiCustomFieldsList
          .querySelectorAll(".quick-add-custom-field-btn")
          .forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const target = e.currentTarget as HTMLButtonElement;
              const key = target.dataset.key || "";
              const label = target.dataset.label || "";
              addCustomFieldDirectly(key, label);
              target.remove();
            });
          });
      } else {
        aiCustomFieldsPanel.classList.add("hidden");
      }
    }

    // Render Metrics Scores
    const qualityVal = document.getElementById("ai-quality-val");
    const qualityBar = document.getElementById("ai-quality-bar");
    const trustVal = document.getElementById("ai-trust-val");
    const trustBar = document.getElementById("ai-trust-bar");
    const visibilityVal = document.getElementById("ai-visibility-val");
    const visibilityBar = document.getElementById("ai-visibility-bar");

    const qScore = data.qualityScore || 0;
    const tScore = data.trustScore || 0;
    const vScore = data.visibilityNeedScore || 0;

    if (qualityVal) qualityVal.textContent = `${qScore}%`;
    if (qualityBar) qualityBar.style.width = `${qScore}%`;
    if (trustVal) trustVal.textContent = `${tScore}%`;
    if (trustBar) trustBar.style.width = `${tScore}%`;
    if (visibilityVal) visibilityVal.textContent = `${vScore}%`;
    if (visibilityBar) visibilityBar.style.width = `${vScore}%`;

    // Render review items
    if (aiReviewPanel && aiReviewItems) {
      aiReviewItems.innerHTML = "";
      let hasReviewItems = false;
      const updates = data.recommendedFieldUpdates || {};

      // A. FIRST, RENDER GUIDED COMPLETION BLOCKS FOR MISSING REQUIRED FIELDS
      const missingList = assistantState.missingBlockers;

      if (missingList.includes("title")) {
        hasReviewItems = true;
        const suggestedTitle =
          data.inferredSuggestions?.suggested_title || updates.title || "";
        const item = document.createElement("div");
        item.className =
          "p-3.5 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 flex flex-col gap-2";
        item.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="font-bold text-[11px] text-red-700 dark:text-red-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              ${t["gen.isar.create.22"]}
            </span>
          </div>
          <span class="text-zinc-650 dark:text-zinc-400 text-xs">${t["gen.isar.create.23"]}</span>
          <div class="flex gap-2">
            <input type="text" id="ai-guided-title-input" value="${suggestedTitle}" class="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-hidden dark:border-zinc-700 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100" />
            <button type="button" id="btn-apply-guided-title" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95">
              ${t["gen.isar.create.24"]}
            </button>
          </div>
        `;
        aiReviewItems.appendChild(item);

        item
          .querySelector("#btn-apply-guided-title")
          ?.addEventListener("click", () => {
            const val = (
              item.querySelector("#ai-guided-title-input") as HTMLInputElement
            ).value.trim();
            if (val) {
              const titleInput = form.querySelector(
                '[name="listing_title"]',
              ) as HTMLInputElement;
              if (titleInput) {
                titleInput.value = val;
                titleInput.dispatchEvent(new Event("input"));
                item.remove();
                debouncedSilentEval();
              }
            }
          });
      }

      if (missingList.includes("city")) {
        hasReviewItems = true;
        const item = document.createElement("div");
        item.className =
          "p-3.5 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 flex flex-col gap-2";
        item.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="font-bold text-[11px] text-red-700 dark:text-red-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ${t["gen.isar.create.25"]}
            </span>
          </div>
          <span class="text-zinc-650 dark:text-zinc-400 text-xs">${t["gen.isar.create.26"]}</span>
          <div class="flex gap-2">
            <input type="text" id="ai-guided-city-input" placeholder="${t["gen.isar.create.27"]}" class="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-hidden dark:border-zinc-700 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100" />
            <button type="button" id="btn-apply-guided-city" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95">
              ${t["gen.isar.create.28"]}
            </button>
          </div>
        `;
        aiReviewItems.appendChild(item);

        item
          .querySelector("#btn-apply-guided-city")
          ?.addEventListener("click", () => {
            const val = (
              item.querySelector("#ai-guided-city-input") as HTMLInputElement
            ).value.trim();
            if (val) {
              const cityInput = document.getElementById(
                "city-input",
              ) as HTMLInputElement;
              if (cityInput) {
                cityInput.value = val;
                cityInput.dispatchEvent(new Event("input"));
                item.remove();
                debouncedSilentEval();
              }
            }
          });
      }

      if (missingList.includes("contact_whatsapp")) {
        hasReviewItems = true;
        const item = document.createElement("div");
        item.className =
          "p-3.5 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 flex flex-col gap-2";
        item.innerHTML = `
          <div class="flex justify-between items-center">
            <span class="font-bold text-[11px] text-red-700 dark:text-red-400 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              ${t["gen.isar.create.29"]}
            </span>
          </div>
          <span class="text-zinc-650 dark:text-zinc-400 text-xs">${t["gen.isar.create.30"]}</span>
          <div class="flex gap-2">
            <input type="tel" id="ai-guided-whatsapp-input" placeholder="0500000000" class="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs outline-hidden dark:border-zinc-700 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100" />
            <button type="button" id="btn-apply-guided-whatsapp" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95">
              ${t["gen.isar.create.31"]}
            </button>
          </div>
        `;
        aiReviewItems.appendChild(item);

        item
          .querySelector("#btn-apply-guided-whatsapp")
          ?.addEventListener("click", () => {
            const val = (
              item.querySelector(
                "#ai-guided-whatsapp-input",
              ) as HTMLInputElement
            ).value.trim();
            if (val) {
              let numberVal = val.replace(/[^0-9]/g, "");
              let codeVal = "+966";
              if (numberVal.startsWith("966")) {
                numberVal = numberVal.substring(3);
              } else if (numberVal.startsWith("0")) {
                numberVal = numberVal.substring(1);
              }
              const numberInput = form.querySelector(
                '[name="contact_whatsapp_number"]',
              ) as HTMLInputElement;
              const codeSelect = form.querySelector(
                '[name="contact_whatsapp_code"]',
              ) as HTMLSelectElement;
              if (numberInput) {
                numberInput.value = numberVal;
                numberInput.dispatchEvent(new Event("input"));
              }
              if (codeSelect) {
                codeSelect.value = codeVal;
                codeSelect.dispatchEvent(new Event("change"));
              }
              item.remove();
              debouncedSilentEval();
            }
          });
      }

      // contact_phone review block removed - whatsapp only


      // B. THEN, RENDER NORMAL REVIEW RECOMMENDATIONS
      const fieldsToReview = [
        {
          key: "title",
          label: t["gen.isar.create.35"],
          selector: '[name="listing_title"]',
        },
        {
          key: "description",
          label: t["gen.isar.create.36"],
          selector: '[name="listing_description"]',
        },
        {
          key: "price",
          label: t["gen.isar.create.37"],
          selector: "#price-input",
        },
        {
          key: "categoryKey",
          label: t["gen.isar.create.38"],
          selector: '[name="categoryKey"]',
        },
        {
          key: "city",
          label: t["gen.isar.create.39"],
          selector: "#city-input",
        },
        {
          key: "district",
          label: t["gen.isar.create.40"],
          selector: "#district-input",
        },
        {
          key: "street",
          label: t["gen.isar.create.41"],
          selector: "#street-input",
        },
        {
          key: "contactMethod",
          label: t["gen.isar.create.42"],
          selector: '[name="contact_method"]',
        },
        {
          key: "listing_condition",
          label: t["gen.isar.create.43"],
          selector: "#condition-input",
        },
        {
          key: "videoUrl",
          label: t["gen.isar.create.44"],
          selector: "#video-url-input",
        },
        {
          key: "negotiable",
          label: t["gen.isar.create.45"],
          selector: '[name="listing_negotiable"]',
        },

      ];

      fieldsToReview.forEach((field) => {
        // Skip rendering title and city as standard diffs if they are already surfaced as blockers above
        if (
          (field.key === "title" && missingList.includes("title")) ||
          (field.key === "city" && missingList.includes("city"))
        ) {
          return;
        }

        const val = updates[field.key];
        if (val !== undefined && val !== null && val !== "") {
          const inputEl = form.querySelector(field.selector) as
            | HTMLInputElement
            | HTMLTextAreaElement
            | HTMLSelectElement;

          let currentVal: any = "";
          if (inputEl) {
            if (inputEl.type === "checkbox") {
              currentVal = (inputEl as HTMLInputElement).checked;
            } else {
              currentVal = inputEl.value;
            }
          }

          if (String(currentVal).trim() !== String(val).trim()) {
            hasReviewItems = true;
            const item = document.createElement("div");
            item.className =
              "flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 gap-2";

            let displayVal = val;
            if (field.key === "categoryKey") {
              const option = form.querySelector(
                `[name="categoryKey"] option[value="${val}"]`,
              ) as HTMLOptionElement;
              if (option) displayVal = option.textContent?.trim() || val;
            } else if (field.key === "listing_condition") {
              displayVal =
                val === "new"
                  ? t["gen.isar.create.47"]
                  : t["gen.isar.create.48"];
            } else if (typeof val === "boolean") {
              displayVal = val
                ? t["gen.isar.create.49"]
                : t["gen.isar.create.50"];
            }

            item.innerHTML = `
              <div class="flex flex-col gap-0.5">
                <span class="font-bold text-[10px] text-zinc-400">${field.label}</span>
                <span class="font-semibold text-zinc-800 dark:text-zinc-200">${displayVal}</span>
              </div>
              <div class="flex gap-1.5 shrink-0 self-end sm:self-center">
                <button type="button" class="btn-apply-single px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold text-[10px] hover:scale-105 active:scale-95 transition-all" data-key="${field.key}" data-value="${val}">
                  ${t["gen.isar.create.51"]}
                </button>
                <button type="button" class="btn-skip-single px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 font-bold text-[10px] hover:scale-105 active:scale-95 transition-all">
                  ${t["gen.isar.create.52"]}
                </button>
              </div>
            `;

            item
              .querySelector(".btn-apply-single")
              ?.addEventListener("click", (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const k = target.dataset.key || "";
                let v: any = target.dataset.value || "";
                if (v === "true") v = true;
                if (v === "false") v = false;

                const singleUpdate: any = {};
                singleUpdate[k] = v;
                applyRecommendedUpdates(singleUpdate);
                item.remove();
                checkReviewPanelVisibility();
              });

            item
              .querySelector(".btn-skip-single")
              ?.addEventListener("click", () => {
                item.remove();
                checkReviewPanelVisibility();
              });

            aiReviewItems.appendChild(item);
          }
        }
      });
      if (hasReviewItems) {
        aiReviewPanel.classList.remove("hidden");
      } else {
        aiReviewPanel.classList.add("hidden");
      }
    }

    // Apply suggestions button visibility
    if (applyAiUpdatesBtn) {
      if (
        data.recommendedFieldUpdates &&
        Object.keys(data.recommendedFieldUpdates).length > 0
      ) {
        applyAiUpdatesBtn.classList.remove("hidden");
      } else {
        applyAiUpdatesBtn.classList.add("hidden");
      }
    }
  }

  function checkReviewPanelVisibility() {
    if (aiReviewItems && aiReviewItems.children.length === 0) {
      aiReviewPanel.classList.add("hidden");
    }
  }

  function addCustomFieldDirectly(
    key: string,
    label: string,
    value: string = "",
  ) {
    customFieldCount++;
    const newField = createCustomFieldInput(label, value);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newField;
    const fieldElement = tempDiv.firstElementChild as HTMLElement;
    customKeyValueContainer.appendChild(fieldElement);
    fieldElement
      .querySelector(".remove-custom-field-btn")
      ?.addEventListener("click", () => {
        fieldElement.remove();
      });
  }

  function applySafePrefill(data: any) {
    if (!data) return;
    const known = data.knownData || {};
    const vehicle = data.vehicleData || {};
    const safePrefill = data.apply_safe_prefill || {};

    // 1. Prefill categoryKey first if categoryKey is present
    if (known.categoryKey) {
      let catVal = known.categoryKey;
      const parentToChildMap: Record<string, string> = {
        cars: "cars-for-sale",
        "real-estate": "apartments-for-sale",
        jobs: "full-time-jobs",
        services: "moving-shipping",
        electronics: "mobiles",
        "home-furniture": "bedroom-furniture",
        "fashion-beauty": "mens-fashion",
        "mother-baby": "strollers-beds",
        "pets-animals": "cats",
        "sports-hobbies": "fitness-equipment",
        "business-industry": "industrial-equipment",
        "food-home-kitchens": "restaurants",
        "travel-tourism": "hotels-bookings",
        "places-venues": "farms-rental",
        "buy-sell-misc": "used-items",
      };
      if (parentToChildMap[catVal]) catVal = parentToChildMap[catVal];

      selectCategoryUI(catVal);
    }

    // 2. Prefill other main fields after a small timeout to ensure DOM hydration of custom fields
    setTimeout(() => {
      const titleInput = form.querySelector(
        '[name="listing_title"]',
      ) as HTMLInputElement;
      const descInput = form.querySelector(
        '[name="listing_description"]',
      ) as HTMLTextAreaElement;
      const priceInput = document.getElementById(
        "price-input",
      ) as HTMLInputElement;
      const cityInput = document.getElementById(
        "city-input",
      ) as HTMLInputElement;
      const districtInput = document.getElementById(
        "district-input",
      ) as HTMLInputElement;
      const streetInput =
        (document.getElementById("street-input") as HTMLInputElement) ||
        form.querySelector('[name="listing_street"]');
      const contactMethodSelect = form.querySelector(
        '[name="contact_method"]',
      ) as HTMLSelectElement;
      const negotiableCheckbox = form.querySelector(
        '[name="listing_negotiable"]',
      ) as HTMLInputElement;


      const conditionInput = document.getElementById(
        "condition-input",
      ) as HTMLSelectElement;

      if (titleInput && known.title) {
        titleInput.value = known.title;
        titleInput.dispatchEvent(new Event("input"));
      }
      if (descInput && known.description) {
        descInput.value = known.description;
        descInput.dispatchEvent(new Event("input"));
      }
      if (conditionInput && known.listing_condition) {
        conditionInput.value =
          known.listing_condition === "new"
            ? "new"
            : known.listing_condition === "refurbished"
              ? "refurbished"
              : "used";
        conditionInput.dispatchEvent(new Event("change"));
      }
      if (
        priceInput &&
        known.price !== undefined &&
        known.price !== null &&
        (safePrefill.price || known.price !== undefined)
      ) {
        priceInput.value = String(known.price);
        priceInput.dispatchEvent(new Event("input"));
      }
      if (cityInput && known.city && (safePrefill.city || known.city)) {
        cityInput.value = known.city;
        cityInput.dispatchEvent(new Event("input"));
      }
      if (districtInput && known.district) {
        districtInput.value = known.district;
        districtInput.dispatchEvent(new Event("input"));
      }
      if (streetInput && known.street) {
        streetInput.value = known.street;
        streetInput.dispatchEvent(new Event("input"));
      }
      if (contactMethodSelect && known.contact_method) {
        contactMethodSelect.value = known.contact_method;
        contactMethodSelect.dispatchEvent(new Event("change"));
      }
      if (
        negotiableCheckbox &&
        known.negotiable !== null &&
        known.negotiable !== undefined
      ) {
        negotiableCheckbox.checked = Boolean(known.negotiable);
        negotiableCheckbox.dispatchEvent(new Event("change"));
      }


      if (known.phone && !String(known.phone).includes("00000000")) {
        let numberVal = String(known.phone);
        let codeVal = "";
        if (numberVal.startsWith("+")) {
          const match = numberVal.match(/^(\+\d{1,4})(.*)$/);
          if (match) {
            codeVal = match[1];
            numberVal = match[2];
          }
        }
        const numberInput = form.querySelector(
          '[name="contact_phone_number"]',
        ) as HTMLInputElement;
        const codeSelect = form.querySelector(
          '[name="contact_phone_code"]',
        ) as HTMLSelectElement;
        if (numberInput) {
          numberInput.value = numberVal;
          numberInput.dispatchEvent(new Event("input"));
        }
        if (codeSelect && codeVal) {
          codeSelect.value = codeVal;
          codeSelect.dispatchEvent(new Event("change"));
        }
      }

      if (known.whatsapp && !String(known.whatsapp).includes("00000000")) {
        let numberVal = String(known.whatsapp);
        let codeVal = "";
        if (numberVal.startsWith("+")) {
          const match = numberVal.match(/^(\+\d{1,4})(.*)$/);
          if (match) {
            codeVal = match[1];
            numberVal = match[2];
          }
        }
        const numberInput = form.querySelector(
          '[name="contact_whatsapp_number"]',
        ) as HTMLInputElement;
        const codeSelect = form.querySelector(
          '[name="contact_whatsapp_code"]',
        ) as HTMLSelectElement;
        if (numberInput) {
          numberInput.value = numberVal;
          numberInput.dispatchEvent(new Event("input"));
        }
        if (codeSelect && codeVal) {
          codeSelect.value = codeVal;
          codeSelect.dispatchEvent(new Event("change"));
        }
      }

      // 3. Prefill Vehicle Custom Fields
      const customMake = form.querySelector(
        '[name="custom_field_vehicle_make"]',
      ) as HTMLInputElement;
      if (customMake && vehicle.make) {
        customMake.value =
          isAr && vehicle.make === "toyota" ? "تويوتا" : vehicle.make;
        customMake.dispatchEvent(new Event("input"));
      }
      const customModel = form.querySelector(
        '[name="custom_field_vehicle_model"]',
      ) as HTMLInputElement;
      if (customModel && vehicle.model) {
        customModel.value =
          isAr && vehicle.model === "yaris"
            ? "يارس"
            : isAr && vehicle.model === "camry"
              ? "كامري"
              : vehicle.model;
        customModel.dispatchEvent(new Event("input"));
      }
      const customYear = form.querySelector(
        '[name="custom_field_vehicle_year"]',
      ) as HTMLInputElement;
      if (customYear && vehicle.year) {
        customYear.value = String(vehicle.year);
        customYear.dispatchEvent(new Event("input"));
      }
      const customMileage = form.querySelector(
        '[name="custom_field_vehicle_mileage"]',
      ) as HTMLInputElement;
      if (customMileage && vehicle.mileage) {
        customMileage.value = String(vehicle.mileage);
        customMileage.dispatchEvent(new Event("input"));
      }
      const customColor = form.querySelector(
        '[name="custom_field_vehicle_color"]',
      ) as HTMLInputElement;
      if (customColor && vehicle.color) {
        customColor.value =
          isAr && vehicle.color === "white" ? "أبيض" : vehicle.color;
        customColor.dispatchEvent(new Event("input"));
      }
      const customTransmission = form.querySelector(
        '[name="custom_field_transmission_type"]',
      ) as HTMLSelectElement;
      if (customTransmission && vehicle.transmission) {
        const transVal =
          vehicle.transmission === "automatic"
            ? "أوتوماتيك"
            : vehicle.transmission === "manual"
              ? "عادي (قير عادي)"
              : vehicle.transmission;
        customTransmission.value = transVal;
        customTransmission.dispatchEvent(new Event("change"));
      }
      const customFuel = form.querySelector(
        '[name="custom_field_fuel_type"]',
      ) as HTMLSelectElement;
      if (customFuel && vehicle.fuel_type) {
        const fuelVal =
          vehicle.fuel_type === "gasoline"
            ? "بنزين"
            : vehicle.fuel_type === "diesel"
              ? "ديزل"
              : vehicle.fuel_type;
        customFuel.value = fuelVal;
        customFuel.dispatchEvent(new Event("change"));
      }
      const customImport = form.querySelector(
        '[name="custom_field_import_status"]',
      ) as HTMLSelectElement;
      if (customImport && vehicle.import_status) {
        customImport.value = vehicle.import_status;
        customImport.dispatchEvent(new Event("change"));
      }

      // 4. Prefill Generic Custom Fields (e.g. from JSON-LD / AI)
      const customData = known.custom_fields || known.customFields || {};
      Object.entries(customData).forEach(([k, val]) => {
        const inputEl = form.querySelector(`[name="custom_field_${k}"]`) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement;
        if (inputEl && val !== undefined && val !== null) {
          if (inputEl.type === "checkbox") {
            (inputEl as HTMLInputElement).checked = Boolean(val);
          } else {
            inputEl.value = String(val);
          }
          inputEl.dispatchEvent(new Event("input"));
          inputEl.dispatchEvent(new Event("change"));
        }
      });
    }, 450);
  }

  function applyRecommendedUpdates(updates: any) {
    if (!updates) return;
    const safePrefill: Record<string, boolean> = {};
    Object.keys(updates).forEach((k) => {
      safePrefill[k] = true;
    });
    applySafePrefill({
      knownData: updates,
      apply_safe_prefill: safePrefill,
    });
  }
  function getCurrentFormData() {
    const currentData: Record<string, any> = {};
    const formData = new FormData(form);
    formData.forEach((val, key) => {
      if (
        !(val instanceof File) &&
        !key.startsWith("custom_field_") &&
        !key.startsWith("custom_kv_")
      ) {
        currentData[key] = val;
      }
    });

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb: any) => {
      if (!cb.name.startsWith("custom_field_")) {
        currentData[cb.name] = cb.checked;
      }
    });

    currentData.contact_method = "whatsapp";
    delete currentData.contact_phone;


    const whatsappCode =
      (
        form.elements.namedItem("contact_whatsapp_code") as
          | HTMLSelectElement
          | HTMLInputElement
          | null
      )?.value || "";
    const whatsappNum =
      (
        form.elements.namedItem(
          "contact_whatsapp_number",
        ) as HTMLInputElement | null
      )?.value || "";
    currentData.contact_whatsapp = whatsappCode + whatsappNum;

    return currentData;
  }

  // Modal toggle listeners
  triggerAiBtn?.addEventListener("click", () => {
    aiChatModal?.classList.remove("hidden");
    aiPromptInput?.focus();

    // Initial greeting if log is empty
    if (aiChatLog && aiChatLog.children.length === 0) {
      appendChatMessage("assistant", t["gen.isar.create.53"]);
    }
  });

  const closeModal = () => {
    aiChatModal?.classList.add("hidden");
  };

  closeAiChatBtn?.addEventListener("click", closeModal);
  aiChatModalOverlay?.addEventListener("click", closeModal);

  applyAiUpdatesBtn?.addEventListener("click", () => {
    if (assistantState.recommendedFieldUpdates) {
      applyRecommendedUpdates(assistantState.recommendedFieldUpdates);
      appendChatMessage("assistant", t["gen.isar.create.54"]);
      applyAiUpdatesBtn.classList.add("hidden");
      if (aiReviewPanel) aiReviewPanel.classList.add("hidden");
    }
  });

  // Silent dynamic background inference function
  async function triggerSilentInference() {
    return;
    const currentFormData = getCurrentFormData();
    let sessionData = {};
    const sessionCookie = getCookie("meamart_session") || "";
    if (sessionCookie) {
      try {
        sessionData = JSON.parse(decodeURIComponent(String(sessionCookie)));
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/ai/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "", // Empty prompt for silent auto-fills and ratings
          lang: t["gen.isar.create.55"],
          currentFormData,
          sessionData,
          assistantState,
          fileContext,
          contextType: "create",
        }),
      });

      const result = await res.json();
      if (result.success) {
        updateAssistantDashboard(result);
      }
    } catch (err) {
      console.warn("Silent dynamic background inference failed:", err);
    }
  }

  // Debounce logic for input fields
  function debounce(func: Function, delay: number) {
    let timer: any;
    return function (...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedSilentEval = debounce(triggerSilentInference, 1200);

  // Bind input listeners for silent background optimization
  const titleInput = form.querySelector(
    '[name="listing_title"]',
  ) as HTMLInputElement;
  const descInput = form.querySelector(
    '[name="listing_description"]',
  ) as HTMLTextAreaElement;
  const priceInput = document.getElementById("price-input") as HTMLInputElement;
  const cityInput = document.getElementById("city-input") as HTMLInputElement;
  const categorySelectEl = form.querySelector(
    '[name="categoryKey"]',
  ) as HTMLSelectElement;

  titleInput?.addEventListener("input", debouncedSilentEval);
  descInput?.addEventListener("input", debouncedSilentEval);
  priceInput?.addEventListener("input", debouncedSilentEval);
  cityInput?.addEventListener("input", debouncedSilentEval);
  categorySelectEl?.addEventListener("change", () => {
    // Immediate silent evaluation on category change (no debounce needed for dropdown)
    triggerSilentInference();
  });

  // Initial evaluation after a brief delay
  setTimeout(() => {
    triggerSilentInference();
  }, 600);

  generateAiBtn?.addEventListener("click", async () => {
    if (
      !aiPromptInput ||
      (!aiPromptInput.value.trim() && !fileContext) ||
      !generateAiBtn
    )
      return;

    const userPrompt = aiPromptInput.value.trim();
    const currentFileName = aiFileInput?.files?.[0]?.name || "";
    appendChatMessage(
      "user",
      userPrompt + (currentFileName ? ` [ملف: ${currentFileName}]` : ""),
    );
    aiPromptInput.value = "";

    generateAiBtn.disabled = true;

    // Get current form state
    const currentFormData = getCurrentFormData();

    // Parse session data
    let sessionData = {};
    const sessionCookie = getCookie("meamart_session");
    if (sessionCookie) {
      try {
        sessionData = JSON.parse(decodeURIComponent(sessionCookie));
      } catch (e) {}
    }

    try {
      const res = await fetch("/api/ai/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          lang: t["gen.isar.create.56"],
          currentFormData,
          sessionData,
          assistantState,
          fileContext,
          contextType: "create",
        }),
      });

      const result = await res.json();

      // Clear file upload input and state
      fileContext = "";
      if (aiFileInput) aiFileInput.value = "";
      if (aiFileBadge) aiFileBadge.classList.add("hidden");

      if (result.success) {
        // Update assistant message & status dashboard
        appendChatMessage("assistant", result.assistantMessage);

        if (result.nextQuestion) {
          appendChatMessage("assistant", result.nextQuestion);
        }

        updateAssistantDashboard(result);
      } else {
        alert(result.error || "AI generation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error during generation");
    } finally {
      generateAiBtn.disabled = false;
    }
  });

  // Smart Fill (تعبئة ذكية) JavaScript
  const smartFillSubmitBtn = document.getElementById(
    "smart-fill-submit-btn",
  ) as HTMLButtonElement;
  const smartFillPrompt = document.getElementById(
    "smart-fill-prompt",
  ) as HTMLTextAreaElement;
  const smartFillBtnText = document.getElementById(
    "smart-fill-btn-text",
  ) as HTMLSpanElement;

  smartFillSubmitBtn?.addEventListener("click", async () => {
    const prompt = smartFillPrompt?.value.trim();
    if (!prompt) return;

    smartFillSubmitBtn.disabled = true;
    if (smartFillBtnText)
      smartFillBtnText.textContent = t["gen.isar.create.57"];

    try {
      let parsedSessionData = {};
      const sessionCookie = getCookie("meamart_session");
      if (sessionCookie) {
        try {
          parsedSessionData = JSON.parse(decodeURIComponent(sessionCookie));
        } catch (e) {}
      }

      const res = await fetch("/api/ai/generate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          lang: t["gen.isar.create.58"],
          currentFormData: getCurrentFormData(),
          sessionData: parsedSessionData,
          contextType: "create",
        }),
      });

      if (!res.ok) {
        let errMessage = "Server Error";
        try {
          const errBody = await res.json();
          errMessage = errBody.error || errMessage;
        } catch (e) {}
        throw new Error(errMessage);
      }

      const result = await res.json();
      if (result.success) {
        applySafePrefill(result);
        updateAssistantDashboard(result);
        if (smartFillPrompt) smartFillPrompt.value = "";
      } else {
        alert(t["gen.isar.create.59"]);
      }
    } catch (e) {
      console.error(e);
      alert(t["gen.isar.create.60"]);
    } finally {
      smartFillSubmitBtn.disabled = false;
      if (smartFillBtnText)
        smartFillBtnText.textContent = t["gen.isar.create.61"];
    }
  });

  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
  const switchLangBtn = document.getElementById(
    "switch-lang-btn",
  ) as HTMLButtonElement;

  const descTextArea = document.getElementById(
    "listing-description-textarea",
  ) as HTMLTextAreaElement;

  if (descTextArea) {
    descTextArea.addEventListener("input", (e) => {
      if (e.isTrusted) {
        if (descTextArea.value.trim() !== "") {
          descTextArea.dataset.userEdited = "true";
        } else {
          descTextArea.removeAttribute("data-user-edited");
        }
      }
    });
  }

    async function autoGenerateMetaDescription(force = false) {
    if (!descTextArea || descTextArea.dataset.generating === "true") return;

    const titleInput = form.querySelector('[name="listing_title"]') as HTMLInputElement;
    const title = titleInput ? titleInput.value.trim() : "";
    if (
      !title ||
      title.length < 2 ||
      (!force && descTextArea.dataset.userEdited === "true")
    )
      return;

    const priceInput = document.getElementById("price-input") as HTMLInputElement;
    const cityInput = document.getElementById("city-input") as HTMLInputElement;
    const districtInput = document.getElementById("district-input") as HTMLInputElement;
    const streetInput = document.getElementById("street-input") as HTMLInputElement;
    const conditionInput = document.getElementById("condition-input") as HTMLSelectElement;
    const currencyInput = document.getElementById("currency-input") as HTMLSelectElement;
    const categorySelect = form.querySelector('[name="categoryKey"]') as HTMLSelectElement;

    const selectedCategory = categorySelect?.selectedOptions?.[0]?.textContent?.trim() || "";
    const parentCategoryKey = getParentCategoryKey(categorySelect?.value || "");
    const price = priceInput?.value.trim() || "";
    const currency =
      currencyInput?.selectedOptions?.[0]?.textContent
        ?.replace(/\s*\(.*?\)\s*/g, "")
        .trim() ||
      currencyInput?.value ||
      "";
    const condition =
      conditionInput?.value === "new"
        ? (t["gen.isar.create.62"] || (isAr ? "جديد" : "New"))
        : conditionInput?.value === "used"
          ? (t["gen.isar.create.63"] || (isAr ? "مستعمل" : "Used"))
          : "";
    const city = cityInput?.value.trim() || "";
    const district = districtInput?.value.trim() || "";
    const street = streetInput?.value.trim() || "";

    const specParts: string[] = [];
    const customInputs = document.querySelectorAll(
      '[name^="custom_field_"]',
    ) as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    customInputs.forEach((input: any) => {
      const label = String(input.dataset.fieldLabel || "").trim();
      if (!label) return;
      if (input instanceof HTMLInputElement && input.type === "checkbox") {
        if (input.checked) {
          specParts.push(`• ${label}: ${t["gen.isar.create.64"] || (isAr ? "نعم" : "Yes")}`);
        }
        return;
      }
      const value = String(input.value || "").trim();
      if (!value) return;
      specParts.push(`• ${label}: ${value}`);
    });

    const hideConditionFor = [
      "jobs",
      "services",
      "real-estate",
      "places-venues",
      "travel-tourism",
      "delivery-shipping",
      "food-home-kitchens",
    ];
    const includeCondition = Boolean(condition) && !hideConditionFor.includes(parentCategoryKey);
    const locationParts = [street, district, city].filter(Boolean);

    let generated = "";
    if (isAr) {
      generated = `✨ عرض مميز: ${title}\n\n`;
      generated += `📋 نظرة عامة:\n`;
      if (selectedCategory) generated += `• التصنيف: ${selectedCategory}\n`;
      if (price) {
        const priceLabel = parentCategoryKey === "jobs" ? "الراتب المقترح" : "السعر المطلوب";
        generated += `• ${priceLabel}: ${price} ${currency}\n`;
      }
      if (includeCondition) generated += `• الحالة: ${condition}\n`;
      if (locationParts.length > 0) generated += `• الموقع: ${locationParts.join("، ")}\n`;

      if (specParts.length > 0) {
        generated += `\n🔍 المواصفات والتفاصيل:\n${specParts.join("\n")}\n`;
      }

      generated += `\n💡 نبذة عن العرض:\n`;
      generated += `إعلان ${title} متوفر حالياً${city ? ` في ${city}` : ""} بأفضل المواصفات المذكورة. فرصة رائعة ومضمونة للباحثين في قسم ${selectedCategory || "العروض المميزة"}.\n\n`;
      generated += `📞 للتواصل والاستفسار:\n`;
      generated += `يرجى التواصل مباشرة عبر الرسائل داخل منصة ميمارت أو الاتصال بالمعلن للاتفاق وإتمام الصفقة.`;
    } else {
      generated = `✨ Featured Offer: ${title}\n\n`;
      generated += `📋 Overview & Pricing:\n`;
      if (selectedCategory) generated += `• Category: ${selectedCategory}\n`;
      if (price) {
        const priceLabel = parentCategoryKey === "jobs" ? "Compensation" : "Price";
        generated += `• ${priceLabel}: ${price} ${currency}\n`;
      }
      if (includeCondition) generated += `• Condition: ${condition}\n`;
      if (locationParts.length > 0) generated += `• Location: ${locationParts.join(", ")}\n`;

      if (specParts.length > 0) {
        generated += `\n🔍 Key Specifications:\n${specParts.join("\n")}\n`;
      }

      generated += `\n💡 Description:\n`;
      generated += `This ${title} is currently available${city ? ` in ${city}` : ""} with premium specifications. An excellent opportunity for those interested in ${selectedCategory || "featured deals"}.\n\n`;
      generated += `📞 Contact & Next Steps:\n`;
      generated += `Reach out directly via MeaMart messaging or call the advertiser to finalize details and arrange a viewing.`;
    }

    descTextArea.dataset.generating = "true";
    descTextArea.value = generated.trim();
    descTextArea.dispatchEvent(new Event("input"));
    delete descTextArea.dataset.generating;
  }

  function autoGenerateTitle(force = false) {
    const titleInput = form.querySelector('[name="listing_title"]') as HTMLInputElement;
    if (!titleInput || (!force && titleInput.dataset.userEdited === "true")) return;

    const categorySelect = form.querySelector('[name="categoryKey"]') as HTMLSelectElement;
    const parentCategoryKey = getParentCategoryKey(categorySelect?.value || "");
    const selectedCategory = categorySelect?.selectedOptions?.[0]?.textContent?.trim() || "";
    const city = (document.getElementById("city-input") as HTMLInputElement)?.value?.trim() || "";
    const district = (document.getElementById("district-input") as HTMLInputElement)?.value?.trim() || "";
    const conditionInput = document.getElementById("condition-input") as HTMLSelectElement;
    const condition = conditionInput?.value === "new" ? (isAr ? "جديد" : "New") : conditionInput?.value === "used" ? (isAr ? "مستعمل" : "Used") : "";

    const parts: string[] = [];
    
    if (parentCategoryKey === "cars") {
      const make = (document.querySelector('[name="custom_field_vehicle_make"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      const model = (document.querySelector('[name="custom_field_vehicle_model"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      const year = (document.querySelector('[name="custom_field_vehicle_year"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      if (make) parts.push(make);
      if (model) parts.push(model);
      if (year) parts.push(`(${year})`);
      if (condition && parts.length > 0) parts.push(`- ${condition}`);
      if (city) parts.push(isAr ? `للبيع في ${city}` : `for sale in ${city}`);
    } else if (parentCategoryKey === "real-estate") {
      const propType = (document.querySelector('[name="custom_field_property_type"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      const rooms = (document.querySelector('[name="custom_field_rooms"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      if (propType) parts.push(propType);
      else if (selectedCategory) parts.push(selectedCategory);
      if (rooms) parts.push(isAr ? `${rooms} غرف` : `${rooms} rooms`);
      if (district && city) parts.push(`في ${district}، ${city}`);
      else if (city) parts.push(`في ${city}`);
    } else if (parentCategoryKey === "electronics") {
      const brand = (document.querySelector('[name="custom_field_brand"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      const model = (document.querySelector('[name="custom_field_model"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      const storage = (document.querySelector('[name="custom_field_storage"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      if (brand) parts.push(brand);
      if (model) parts.push(model);
      if (storage) parts.push(storage);
      if (condition && parts.length > 0) parts.push(`- بحالة ${condition}`);
      if (city && parts.length > 0) parts.push(`في ${city}`);
    } else if (parentCategoryKey === "jobs") {
      const jobTitle = (document.querySelector('[name="custom_field_job_title"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      const empType = (document.querySelector('[name="custom_field_employment_type"]') as HTMLSelectElement | HTMLInputElement)?.value?.trim();
      if (jobTitle) parts.push(jobTitle);
      else if (selectedCategory) parts.push(selectedCategory);
      if (empType) parts.push(`(${empType})`);
      if (city) parts.push(`- ${city}`);
    }

    if (parts.length === 0) {
      if (selectedCategory) parts.push(selectedCategory);
      const customInputs = document.querySelectorAll(
        '#custom-fields-container input:not([type="checkbox"]), #custom-fields-container select'
      );
      let count = 0;
      customInputs.forEach((input: any) => {
        if (count >= 2) return;
        const val = input.value?.trim();
        if (val) {
          parts.push(val);
          count++;
        }
      });
      if (city) parts.push(isAr ? `في ${city}` : `in ${city}`);
    }

    if (parts.length > 0) {
      const newTitle = parts.join(" ").replace(/\s+/g, " ").trim();
      titleInput.value = newTitle;
      titleInput.dispatchEvent(new Event("input"));
    }
  }

  const debouncedAutoGenerateContent = debounce(() => {
    autoGenerateTitle();
    autoGenerateMetaDescription();
  }, 1500);

  // Bind input change events for real-time description generation
  const formTitleInput = form.querySelector(
    '[name="listing_title"]',
  ) as HTMLInputElement;
  const formPriceInput = document.getElementById(
    "price-input",
  ) as HTMLInputElement;
  const formCityInput = document.getElementById(
    "city-input",
  ) as HTMLInputElement;
  const formDistrictInput = document.getElementById(
    "district-input",
  ) as HTMLInputElement;
  const formStreetInput = document.getElementById(
    "street-input",
  ) as HTMLInputElement;
  const formCategorySelectEl = form.querySelector(
    '[name="categoryKey"]',
  ) as HTMLSelectElement;
  const formConditionSelectEl = document.getElementById(
    "condition-input",
  ) as HTMLSelectElement;

  formTitleInput?.addEventListener(
    "input",
    debouncedAutoGenerateContent,
  );
  formPriceInput?.addEventListener(
    "input",
    debouncedAutoGenerateContent,
  );
  formCityInput?.addEventListener(
    "input",
    debouncedAutoGenerateContent,
  );
  formDistrictInput?.addEventListener(
    "input",
    debouncedAutoGenerateContent,
  );
  formStreetInput?.addEventListener(
    "input",
    debouncedAutoGenerateContent,
  );
  formCategorySelectEl?.addEventListener(
    "change",
    debouncedAutoGenerateContent,
  );
  formConditionSelectEl?.addEventListener(
    "change",
    debouncedAutoGenerateContent,
  );

  // Monitor dynamic custom fields container changes
  const observer = new MutationObserver(() => {
    const customInputs = document.querySelectorAll(
      "#custom-fields-container input, #custom-fields-container select",
    );
    customInputs.forEach((input: any) => {
      if (!input.dataset.descBound) {
        input.dataset.descBound = "true";
        input.addEventListener("input", debouncedAutoGenerateContent);
        input.addEventListener("change", debouncedAutoGenerateContent);
      }
    });
    debouncedAutoGenerateContent();
  });

  const customFieldsContainerEl = document.getElementById(
    "custom-fields-container",
  );
  if (customFieldsContainerEl) {
    observer.observe(customFieldsContainerEl, {
      childList: true,
      subtree: true,
    });
  }

  // Dynamic Custom Fields Elements
  const categorySelect = form.querySelector(
    '[name="categoryKey"]',
  ) as HTMLSelectElement;
  const customFieldsContainer = document.getElementById(
    "custom-fields-container",
  ) as HTMLDivElement;
  const customFieldsHeading = document.getElementById(
    "custom-fields-heading",
  ) as HTMLHeadingElement;
  const metadataDiv = document.getElementById(
    "custom-fields-metadata",
  ) as HTMLDivElement;
  let customFieldsData: any = {};
  let catalogProducts: any[] = [];

  const catalogDataPromise = fetch("/api/catalog-data")
    .then((res) => res.json())
    .then((data) => {
      catalogProducts = data.catalogProducts || [];
      customFieldsData = data.customFieldsByCategory || {};
      return data;
    })
    .catch((err) => {
      console.error("Failed to load catalog data:", err);
      return { catalogProducts: [], customFieldsByCategory: {} };
    });

  const catalogSearchInput = document.getElementById(
    "catalog-search-input",
  ) as HTMLInputElement;
  const catalogSearchResults = document.getElementById(
    "catalog-search-results",
  ) as HTMLDivElement;
  const selectedProductBadge = document.getElementById(
    "selected-product-badge",
  ) as HTMLDivElement;
  const selectedProductName = document.getElementById(
    "selected-product-name",
  ) as HTMLSpanElement;
  const clearSelectedProductBtn = document.getElementById(
    "clear-selected-product",
  ) as HTMLButtonElement;
  const linkedProductIdHidden = document.getElementById(
    "linked-product-id-hidden",
  ) as HTMLInputElement;

  let originalValues = {
    title: "",
    description: "",
  };

  const productParentCategories = [
    "electronics",
    "home-furniture",
    "fashion-beauty",
    "mother-baby",
    "pets-animals",
    "sports-hobbies",
    "business-industry",
    "food-home-kitchens",
    "buy-sell-misc",
  ];

  function updateCatalogVisibility(subKey: string) {
    const parentKey = getParentCategoryKey(subKey);
    const container = document.getElementById(
      "catalog-product-selector-container",
    );
    if (!container) return;

    if (productParentCategories.includes(parentKey)) {
      container.classList.remove("hidden");
    } else {
      container.classList.add("hidden");
      clearSelectedCatalogProduct();
    }
  }

  function selectCatalogProduct(prodId: number) {
    const product = catalogProducts.find(
      (p: any) => Number(p.id) === Number(prodId),
    );
    if (!product) return;

    const titleInput = form.querySelector(
      '[name="listing_title"]',
    ) as HTMLInputElement;
    const descInput = form.querySelector(
      '[name="listing_description"]',
    ) as HTMLTextAreaElement;

    if (!linkedProductIdHidden?.value) {
      originalValues.title = titleInput?.value || "";
      originalValues.description = descInput?.value || "";
    }

    if (linkedProductIdHidden) linkedProductIdHidden.value = String(product.id);

    if (selectedProductBadge) {
      selectedProductBadge.classList.remove("hidden");
      selectedProductBadge.classList.add("flex");
    }
    if (selectedProductName) {
      selectedProductName.textContent = `${product.name} (SKU: ${product.sku}) - ${t["gen.isar.create.65"]}`;
    }

    if (catalogSearchResults) catalogSearchResults.classList.add("hidden");
    if (catalogSearchInput) {
      catalogSearchInput.value = "";
      catalogSearchInput.classList.add("hidden");
    }

    if (titleInput) {
      titleInput.value = product.name;
      titleInput.readOnly = true;
      titleInput.classList.add(
        "bg-zinc-100",
        "dark:bg-zinc-800/80",
        "cursor-not-allowed",
        "text-zinc-500",
      );
    }
    if (descInput) {
      descInput.value = product.description;
      descInput.readOnly = true;
      descInput.classList.add(
        "bg-zinc-100",
        "dark:bg-zinc-800/80",
        "cursor-not-allowed",
        "text-zinc-500",
      );
    }

    if (product.categories && product.categories.length > 0) {
      const matchName = product.categories[0].toLowerCase();
      if (categorySelect) {
        let foundVal = "";
        for (let i = 0; i < categorySelect.options.length; i++) {
          const opt = categorySelect.options[i];
          const text = opt.text.toLowerCase();
          const val = opt.value.toLowerCase();
          if (
            text.includes(matchName) ||
            matchName.includes(text) ||
            val.includes(matchName) ||
            matchName.includes(val)
          ) {
            foundVal = opt.value;
            break;
          }
        }
        if (foundVal) {
          categorySelect.value = foundVal;
          const event = new Event("change");
          categorySelect.dispatchEvent(event);
        }
      }
    }
  }

  function clearSelectedCatalogProduct() {
    const wasSelected = linkedProductIdHidden && !!linkedProductIdHidden.value;
    if (linkedProductIdHidden) linkedProductIdHidden.value = "";

    if (selectedProductBadge) {
      selectedProductBadge.classList.add("hidden");
      selectedProductBadge.classList.remove("flex");
    }
    if (catalogSearchInput) {
      catalogSearchInput.classList.remove("hidden");
      catalogSearchInput.value = "";
    }

    const titleInput = form.querySelector(
      '[name="listing_title"]',
    ) as HTMLInputElement;
    const descInput = form.querySelector(
      '[name="listing_description"]',
    ) as HTMLTextAreaElement;

    if (titleInput) {
      if (wasSelected) titleInput.value = originalValues.title;
      titleInput.readOnly = false;
      titleInput.classList.remove(
        "bg-zinc-100",
        "dark:bg-zinc-800/80",
        "cursor-not-allowed",
        "text-zinc-500",
      );
    }
    if (descInput) {
      if (wasSelected) descInput.value = originalValues.description;
      descInput.readOnly = false;
      descInput.classList.remove(
        "bg-zinc-100",
        "dark:bg-zinc-800/80",
        "cursor-not-allowed",
        "text-zinc-500",
      );
    }
  }

  catalogSearchInput?.addEventListener("input", () => {
    const query = catalogSearchInput.value.toLowerCase().trim();
    if (!query) {
      catalogSearchResults.classList.add("hidden");
      return;
    }

    const filtered = catalogProducts.filter((p: any) => {
      return (
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    });

    if (filtered.length === 0) {
      catalogSearchResults.innerHTML = `
        <div class="p-4 text-xs text-zinc-550 dark:text-zinc-400 text-center flex flex-col items-center gap-2">
          <span>${t["gen.isar.create.66"]}</span>
          <button type="button" id="btn-skip-search" class="mt-1 rounded-full bg-primary/10 text-primary px-3 py-1.5 font-bold hover:bg-primary/20 transition-all">
            ${t["gen.isar.create.67"]}
          </button>
        </div>
      `;
      catalogSearchResults
        .querySelector("#btn-skip-search")
        ?.addEventListener("click", () => {
          catalogSearchResults.classList.add("hidden");
          if (catalogSearchInput) catalogSearchInput.value = "";
        });
    } else {
      catalogSearchResults.innerHTML = filtered
        .map(
          (p: any) => `
        <button 
          type="button" 
          class="catalog-option-btn w-full text-start p-3 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between transition-colors" 
          data-id="${p.id}"
        >
          <div>
            <div class="font-bold text-zinc-800 dark:text-zinc-200">${p.name}</div>
            <div class="text-[10px] text-zinc-500 mt-0.5">SKU: ${p.sku} ${p.brand ? `· ${p.brand}` : ""}</div>
          </div>
          <span class="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full">${p.price} ${t["gen.isar.create.68"]}</span>
        </button>
      `,
        )
        .join("");
    }

    catalogSearchResults.classList.remove("hidden");

    catalogSearchResults
      .querySelectorAll(".catalog-option-btn")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const target = e.currentTarget as HTMLButtonElement;
          const id = Number(target.dataset.id);
          selectCatalogProduct(id);
        });
      });
  });

  document.addEventListener("click", (e) => {
    if (
      catalogSearchResults &&
      !catalogSearchResults.classList.contains("hidden")
    ) {
      const isClickInside =
        catalogSearchInput.contains(e.target as Node) ||
        catalogSearchResults.contains(e.target as Node);
      if (!isClickInside) {
        catalogSearchResults.classList.add("hidden");
      }
    }
  });

  clearSelectedProductBtn?.addEventListener(
    "click",
    clearSelectedCatalogProduct,
  );

  // Custom Key-Value Fields Management
  const customKeyValueContainer = document.getElementById(
    "custom-key-value-container",
  ) as HTMLDivElement;
  const addCustomFieldBtn = document.getElementById(
    "add-custom-field-btn",
  ) as HTMLButtonElement;
  let customFieldCount = 0;

  function createCustomFieldInput(keyVal = "", valueVal = "", id = ""): string {
    const fieldId = id || `custom-kv-${Date.now()}-${Math.random()}`;
    const keyPlaceholder = t["gen.isar.create.69"];
    const valuePlaceholder = t["gen.isar.create.70"];

    return `
      <div class="flex flex-col sm:flex-row gap-2 sm:items-end custom-kv-field group border border-zinc-200/40 dark:border-zinc-800/40 p-3 rounded-full bg-zinc-50/20 dark:bg-zinc-900/10 w-full" data-field-id="${fieldId}">
        <div class="flex-1 w-full">
          <input 
            type="text" 
            name="custom_kv_key_${customFieldCount}" 
            value="${keyVal}"
            placeholder="${keyPlaceholder}"
            class="form-input"
            required
          />
        </div>
        <div class="flex-1 w-full flex gap-2">
          <input 
            type="text" 
            name="custom_kv_value_${customFieldCount}" 
            value="${valueVal}"
            placeholder="${valuePlaceholder}"
            class="form-input flex-1"
            required
          />
          <button 
            type="button" 
            class="remove-custom-field-btn flex-shrink-0 rounded-full bg-red-100 p-3 text-red-600 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            aria-label="Remove field"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  addCustomFieldBtn?.addEventListener("click", () => {
    customFieldCount++;
    const newField = createCustomFieldInput();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newField;
    const fieldElement = tempDiv.firstElementChild as HTMLElement;

    customKeyValueContainer.appendChild(fieldElement);

    // Add remove listener to new field
    fieldElement
      .querySelector(".remove-custom-field-btn")
      ?.addEventListener("click", () => {
        fieldElement.remove();
      });

    // Focus on key input
    (
      fieldElement.querySelector('[name^="custom_kv_key_"]') as HTMLInputElement
    )?.focus();
  });

  // Handle remove button clicks (event delegation)
  customKeyValueContainer?.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".remove-custom-field-btn");
    if (btn) {
      btn.closest(".custom-kv-field")?.remove();
    }
  });

  function getParentCategoryKey(subKey: string): string {
    if (!subKey) return "";
    if (
      subKey.startsWith("cars") ||
      subKey === "classic-cars" ||
      subKey === "luxury-cars" ||
      subKey === "scrap-cars" ||
      subKey === "special-plates" ||
      subKey.startsWith("car-") ||
      subKey === "tires-batteries"
    ) {
      return "cars";
    }
    if (
      subKey.includes("apartment") ||
      subKey.includes("villa") ||
      subKey === "lands" ||
      subKey === "buildings" ||
      subKey === "offices-shops" ||
      subKey === "warehouses" ||
      subKey === "chalets-resthouses" ||
      subKey === "shared-housing"
    ) {
      return "real-estate";
    }
    if (
      subKey.includes("job") ||
      subKey === "internships" ||
      subKey === "drivers-delivery-jobs" ||
      subKey === "admin-jobs" ||
      subKey === "tech-jobs" ||
      subKey === "sales-marketing-jobs" ||
      subKey === "skilled-labor-jobs"
    ) {
      return "jobs";
    }
    if (
      subKey.includes("service") ||
      subKey === "moving-shipping" ||
      subKey === "delivery-shipping" ||
      subKey === "maintenance-services" ||
      subKey === "cleaning-services" ||
      subKey === "tech-services" ||
      subKey === "design-printing" ||
      subKey === "marketing-services" ||
      subKey === "legal-services" ||
      subKey === "accounting-services" ||
      subKey === "education-training-services" ||
      subKey === "events-services"
    ) {
      return "services";
    }
    if (
      subKey === "mobiles" ||
      subKey === "tablets" ||
      subKey === "laptops" ||
      subKey === "computers" ||
      subKey === "tv-screens" ||
      subKey === "cameras" ||
      subKey === "audio-devices" ||
      subKey === "gaming-devices" ||
      subKey === "networking-devices" ||
      subKey === "electronic-parts"
    ) {
      return "electronics";
    }
    if (
      subKey.includes("furniture") ||
      subKey === "kitchen-home-tools" ||
      subKey === "decor-lighting" ||
      subKey === "carpets-bedding" ||
      subKey === "home-appliances" ||
      subKey === "garden-supplies"
    ) {
      return "home-furniture";
    }
    if (
      subKey.includes("fashion") ||
      subKey === "shoes" ||
      subKey === "bags-accessories" ||
      subKey === "watches-jewelry" ||
      subKey === "perfumes" ||
      subKey === "cosmetics" ||
      subKey === "personal-care"
    ) {
      return "fashion-beauty";
    }
    if (
      subKey === "strollers-beds" ||
      subKey === "baby-clothes" ||
      subKey === "kids-toys" ||
      subKey === "feeding-supplies" ||
      subKey === "nursery-supplies" ||
      subKey === "child-car-seats"
    ) {
      return "mother-baby";
    }
    if (
      subKey === "cats" ||
      subKey === "dogs" ||
      subKey === "birds" ||
      subKey === "fish" ||
      subKey === "horses" ||
      subKey === "livestock-feed" ||
      subKey === "pet-supplies" ||
      subKey === "veterinary-services"
    ) {
      return "pets-animals";
    }
    if (
      subKey === "fitness-equipment" ||
      subKey === "bicycles" ||
      subKey === "camping-outdoor" ||
      subKey === "hunting-shooting" ||
      subKey === "books" ||
      subKey === "musical-instruments" ||
      subKey === "collectibles-hobbies" ||
      subKey === "tickets-events"
    ) {
      return "sports-hobbies";
    }
    if (
      subKey === "industrial-equipment" ||
      subKey === "restaurant-cafe-equipment" ||
      subKey === "medical-equipment" ||
      subKey === "agricultural-equipment" ||
      subKey === "construction-materials" ||
      subKey === "business-opportunities" ||
      subKey === "franchise-opportunities" ||
      subKey === "businesses-for-sale"
    ) {
      return "business-industry";
    }
    if (
      subKey === "home-cooked-meals" ||
      subKey === "desserts-bakery" ||
      subKey === "catering-events" ||
      subKey === "homemade-products" ||
      subKey === "drinks-coffee" ||
      subKey === "restaurants" ||
      subKey === "cafes-sweets" ||
      subKey === "tea-cafes"
    ) {
      return "food-home-kitchens";
    }
    if (
      subKey === "farms-rental" ||
      subKey === "resthouses-rental" ||
      subKey === "chalets-resorts" ||
      subKey === "beach-camps" ||
      subKey === "event-halls"
    ) {
      return "places-venues";
    }
    if (
      subKey === "hotels-bookings" ||
      subKey === "tours" ||
      subKey === "tourist-car-rental" ||
      subKey === "travel-packages" ||
      subKey === "tourism-services"
    ) {
      return "travel-tourism";
    }
    if (
      subKey === "used-items" ||
      subKey === "gifts" ||
      subKey === "rare-items" ||
      subKey === "seasonal-products" ||
      subKey === "used-items"
    ) {
      return "buy-sell-misc";
    }
    return "";
  }

  function renderCustomFields(
    subCategoryKey: string,
    prefilledValues: Record<string, any> = {},
  ) {
    if (!customFieldsContainer || !customFieldsHeading) return;
    const parentKey = getParentCategoryKey(subCategoryKey);
    const fields = customFieldsData[parentKey] || [];

    if (fields.length === 0) {
      customFieldsContainer.innerHTML = "";
      customFieldsHeading.classList.add("hidden");
      return;
    }

    const selectPlaceholder = t["gen.isar.create.71"];
    const booleanYes = t["gen.isar.create.72"];

    customFieldsHeading.classList.remove("hidden");
    customFieldsContainer.innerHTML = fields
      .map((field: any) => {
        const label = isAr ? field.label : field.english_label;
        const key = field.meta_key;
        const value =
          prefilledValues[key] !== undefined ? prefilledValues[key] : "";

        const isRequired = field.required ? "required" : "";
        const reqAsterisk = field.required ? " *" : "";

        let inputHtml = "";

        if (field.type === "select") {
          const rawOptions = langValue(
            field.options,
            field.english_options || field.options,
          );
          const options = Array.isArray(rawOptions)
            ? rawOptions
            : String(rawOptions || "")
                .split(",")
                .map((opt: string) => opt.trim())
                .filter(Boolean);
          const values = Array.isArray(field.options) ? field.options : options;
          const optionsHtml = options
            .map((opt: string, idx: number) => {
              const valAttr = values[idx] || opt;
              const isSelected =
                String(value) === String(valAttr) ? "selected" : "";
              return `<option value="${valAttr}" ${isSelected}>${opt}</option>`;
            })
            .join("");

          inputHtml = `
          <select name="custom_field_${key}" data-field-label="${label}" ${isRequired} class="form-select">
            <option value="">${selectPlaceholder}</option>
            ${optionsHtml}
          </select>
        `;
        } else if (field.type === "textarea") {
          inputHtml = `
          <textarea name="custom_field_${key}" data-field-label="${label}" ${isRequired} rows="3" class="form-textarea">${value}</textarea>
        `;
        } else if (field.type === "boolean") {
          const isChecked =
            value === true || value === "true" || value === 1 || value === "1"
              ? "checked"
              : "";
          inputHtml = `
          <div class="flex items-center h-11">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="custom_field_${key}" data-field-label="${label}" ${isChecked} class="rounded border-zinc-300 text-primary focus:ring-primary dark:border-zinc-700" />
              <span class="text-xs font-bold text-zinc-600 dark:text-zinc-400">${booleanYes}</span>
            </label>
          </div>
        `;
        } else {
          const inputType =
            field.type === "number"
              ? "number"
              : field.type === "date"
                ? "date"
                : "text";
          inputHtml = `
          <input type="${inputType}" name="custom_field_${key}" data-field-label="${label}" value="${value}" ${isRequired} class="form-input" />
        `;
        }

        return `
        <div>
          <label class="form-label">
            ${label}${reqAsterisk}
          </label>
          ${inputHtml}
        </div>
      `;
      })
      .join("");
  }

  // Handle price requirements based on category
  function handleCategoryChange(subKey: string) {
    const parentKey = getParentCategoryKey(subKey);
    const priceContainer = document.getElementById("price-container");
    const priceLabel = document.getElementById("price-label");
    const priceInput = document.getElementById(
      "price-input",
    ) as HTMLInputElement;
    const currencyContainer = document.getElementById("currency-container");
    const currencyLabel = document.getElementById("currency-label");
    const currencyInput = document.getElementById(
      "currency-input",
    ) as HTMLSelectElement;
    const conditionContainer = document.getElementById("condition-container");
    const conditionInput = document.getElementById(
      "condition-input",
    ) as HTMLSelectElement;

    if (
      !priceContainer ||
      !priceLabel ||
      !priceInput ||
      !currencyContainer ||
      !currencyLabel ||
      !currencyInput
    )
      return;

    const defaultLabel =
      priceContainer.getAttribute("data-default-label") || "";
    const salaryLabel = priceContainer.getAttribute("data-salary-label") || "";
    const optionalText =
      priceContainer.getAttribute("data-optional-text") || "";
    const defaultCurrencyLabel =
      currencyContainer.getAttribute("data-default-label") || "";

    if (conditionContainer) conditionContainer.style.display = "none";
    if (conditionInput) {
      conditionInput.required = false;
    }

    const priceAlert = document.getElementById("price-not-needed-alert");

    if (parentKey === "jobs") {
      priceInput.required = false;
      currencyInput.required = false;
      priceContainer.classList.add("hidden");
      currencyContainer.classList.add("hidden");
      if (priceAlert) priceAlert.classList.remove("hidden");
    } else {
      priceContainer.classList.remove("hidden");
      currencyContainer.classList.remove("hidden");
      if (priceAlert) priceAlert.classList.add("hidden");

      if (
        parentKey === "services" ||
        parentKey === "pets-animals" ||
        parentKey === "buy-sell-misc"
      ) {
        priceInput.required = false;
        currencyInput.required = false;
        priceLabel.innerHTML = `${defaultLabel} <span class="font-normal text-zinc-400">${optionalText}</span>`;
        currencyLabel.innerHTML = `${defaultCurrencyLabel} <span class="font-normal text-zinc-400">${optionalText}</span>`;
      } else {
        priceInput.required = true;
        currencyInput.required = true;
        priceLabel.innerHTML = `${defaultLabel} *`;
        currencyLabel.innerHTML = `${defaultCurrencyLabel} *`;
      }
    }
  }

  // Listen to category changes
  categorySelect?.addEventListener("change", (e) => {
    const val = (e.target as HTMLSelectElement).value;
    renderCustomFields(val);
    handleCategoryChange(val);
    updateCatalogVisibility(val);
  });

  const bootstrapGoogleMaps = () => {
    (window as any).initAutocomplete = () => {
      if (!(window as any).google?.maps?.places) return;
      const addressInput = document.getElementById(
        "address-input",
      ) as HTMLInputElement;
      if (!addressInput) return;
      addressInput.setAttribute("autocomplete", "off");
      const autocomplete = new (window as any).google.maps.places.Autocomplete(
        addressInput,
        {
          types: ["geocode", "establishment"],
          componentRestrictions: {
            country: ["sa", "ae", "qa", "kw", "bh", "om"],
          },
        },
      );

      const mapWrapper = document.getElementById("map-container-wrapper");
      const mapContainer = document.getElementById("map-container");
      let map: any = null;
      let marker: any = null;
      const geocoder = new (window as any).google.maps.Geocoder();

      const cityInput = document.getElementById(
        "city-input",
      ) as HTMLInputElement;
      const districtInput = document.getElementById(
        "district-input",
      ) as HTMLInputElement;
      const streetInput = document.getElementById(
        "street-input",
      ) as HTMLInputElement;
      const latInput = document.getElementById("lat-input") as HTMLInputElement;
      const lngInput = document.getElementById("lng-input") as HTMLInputElement;
      const shortAddressWrap = document.getElementById(
        "sa-short-address-wrap",
      ) as HTMLDivElement;
      const shortAddressInput = document.getElementById(
        "sa-short-address-input",
      ) as HTMLInputElement;
      const shortAddressBtn = document.getElementById(
        "sa-short-address-btn",
      ) as HTMLButtonElement;
      const shortAddressStatus = document.getElementById(
        "sa-short-address-status",
      ) as HTMLParagraphElement;

      const applyAddressComponents = (components: any[] = []) => {
        let city = "";
        let district = "";
        let street = "";
        let streetNumber = "";

        components.forEach((c: any) => {
          const types = c.types || [];
          if (
            types.includes("locality") ||
            types.includes("administrative_area_level_2")
          ) {
            city = c.long_name;
          }
          if (
            types.includes("sublocality") ||
            types.includes("neighborhood") ||
            types.includes("administrative_area_level_3")
          ) {
            district = c.long_name;
          }
          if (types.includes("route")) {
            street = c.long_name;
          }
          if (types.includes("street_number")) {
            streetNumber = c.long_name;
          }
        });

        if (city && cityInput) cityInput.value = city;
        if (district && districtInput) districtInput.value = district;
        if ((street || streetNumber) && streetInput) {
          streetInput.value = [street, streetNumber]
            .filter(Boolean)
            .join(" ")
            .trim();
        }
      };

      const savedAddressSelect = document.getElementById(
        "saved-address-select",
      ) as HTMLSelectElement;
      if (savedAddressSelect) {
        savedAddressSelect.addEventListener("change", () => {
          const selectedOption =
            savedAddressSelect.options[savedAddressSelect.selectedIndex];
          if (!selectedOption || !selectedOption.value) return;

          const address = selectedOption.dataset.address || "";
          const city = selectedOption.dataset.city || "";
          const district = selectedOption.dataset.district || "";
          const lat = parseFloat(selectedOption.dataset.lat || "0");
          const lng = parseFloat(selectedOption.dataset.lng || "0");

          if (addressInput) addressInput.value = address;
          if (cityInput) cityInput.value = city;
          if (districtInput) districtInput.value = district;
          if (latInput && lat) latInput.value = String(lat);
          if (lngInput && lng) lngInput.value = String(lng);

          if (lat && lng) {
            initMap(lat, lng);
            const lMap = (window as any).leafletMap;
            const lMarker = (window as any).leafletMarker;
            if (lMap && lMarker) {
              lMap.setView([lat, lng], 15);
              lMarker.setLatLng([lat, lng]);
              setTimeout(() => lMap.invalidateSize(), 100);
            }
          }
        });
      }

      function initLeafletMapFallback(lat: number, lng: number) {
        if (typeof (window as any).initLeafletMapFallback === "function") {
          return (window as any).initLeafletMapFallback(lat, lng);
        }
      }

      function initMap(lat: number, lng: number) {
        if (!mapContainer) return;
        if (mapWrapper) mapWrapper.classList.remove("hidden");

        if (
          !(window as any).google?.maps?.Map ||
          (window as any).__meamartGoogleMapsAuthFailed
        ) {
          return initLeafletMapFallback(lat, lng);
        }

        const pos = { lat, lng };
        if ((window as any).googleMap && (window as any).googleMarker) {
          map = (window as any).googleMap;
          marker = (window as any).googleMarker;
          map.setCenter(pos);
          marker.setPosition(pos);
          map.setZoom(15);
          return;
        }

        map = new (window as any).google.maps.Map(mapContainer, {
          zoom: 15,
          center: pos,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        marker = new (window as any).google.maps.Marker({
          position: pos,
          map: map,
          draggable: true,
        });

        (window as any).googleMap = map;
        (window as any).googleMarker = marker;

        marker.addListener("dragend", () => {
          const newPos = marker.getPosition();
          if (latInput) latInput.value = String(newPos.lat());
          if (lngInput) lngInput.value = String(newPos.lng());

          geocoder.geocode(
            { location: newPos },
            (results: any, status: any) => {
              if (status === "OK" && results[0]) {
                addressInput.value = results[0].formatted_address;
                applyAddressComponents(results[0].address_components || []);
              }
            },
          );
        });

        map.addListener("click", (event: any) => {
          const clickedPos = event.latLng;
          marker.setPosition(clickedPos);
          map.panTo(clickedPos);

          if (latInput) latInput.value = String(clickedPos.lat());
          if (lngInput) lngInput.value = String(clickedPos.lng());

          geocoder.geocode(
            { location: clickedPos },
            (results: any, status: any) => {
              if (status === "OK" && results[0]) {
                addressInput.value = results[0].formatted_address;
                applyAddressComponents(results[0].address_components || []);
              }
            },
          );
        });
      }

      const countryInput = document.getElementById(
        "country-input",
      ) as HTMLSelectElement;

      const isSaudiSelection = () => {
        if (!countryInput) return false;
        const option = countryInput.options[countryInput.selectedIndex];
        const code = String(option?.dataset?.code || "").toUpperCase();
        return code === "SA";
      };

      const setShortAddressStatus = (
        message: string,
        tone: "normal" | "success" | "error" = "normal",
      ) => {
        if (!shortAddressStatus) return;
        shortAddressStatus.textContent = message;
        shortAddressStatus.classList.remove(
          "text-zinc-500",
          "dark:text-zinc-400",
          "text-emerald-600",
          "dark:text-emerald-400",
          "text-red-600",
          "dark:text-red-400",
        );
        if (tone === "success") {
          shortAddressStatus.classList.add(
            "text-emerald-600",
            "dark:text-emerald-400",
          );
          return;
        }
        if (tone === "error") {
          shortAddressStatus.classList.add("text-red-600", "dark:text-red-400");
          return;
        }
        shortAddressStatus.classList.add("text-zinc-500", "dark:text-zinc-400");
      };

      const toggleSaudiShortAddress = () => {
        if (!shortAddressWrap) return;
        const show = isSaudiSelection();
        shortAddressWrap.classList.toggle("hidden", !show);
        if (!show) {
          if (shortAddressInput) shortAddressInput.value = "";
          setShortAddressStatus("");
        }
      };

      const applySaudiAddress = (address: any) => {
        if (!address) return;
        const formatted = String(address.formattedAddress || "").trim();
        if (formatted && addressInput) addressInput.value = formatted;
        if (address.city && cityInput) cityInput.value = String(address.city);
        if (address.district && districtInput)
          districtInput.value = String(address.district);
        if (address.street && streetInput)
          streetInput.value = String(address.street);

        const lat = Number(address.lat);
        const lng = Number(address.lng);
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          if (latInput) latInput.value = String(lat);
          if (lngInput) lngInput.value = String(lng);

          const gMap = (window as any).googleMap;
          const gMarker = (window as any).googleMarker;
          if (gMap && gMarker) {
            const pos = { lat, lng };
            gMap.setCenter(pos);
            gMap.setZoom(16);
            gMarker.setPosition(pos);
            if (mapWrapper) mapWrapper.classList.remove("hidden");
          }
          const lMap = (window as any).leafletMap;
          const lMarker = (window as any).leafletMarker;
          if (lMap && lMarker) {
            const pos = [lat, lng];
            lMap.setView(pos, 16);
            lMarker.setLatLng(pos);
            setTimeout(() => lMap.invalidateSize(), 100);
            if (mapWrapper) mapWrapper.classList.remove("hidden");
          }
        }

        addressInput?.dispatchEvent(new Event("input"));
        cityInput?.dispatchEvent(new Event("input"));
        districtInput?.dispatchEvent(new Event("input"));
        streetInput?.dispatchEvent(new Event("input"));
      };

      const isValidSaudiShortAddress = (rawValue: string) => {
        const value = rawValue.trim();
        if (!value) return false;

        const compact = value.replace(/[\s\-]/g, "");
        if (/^[A-Za-z]{4}\d{4}$/i.test(compact)) return true;

        const digitGroups = value.match(/\d{4,5}/g) || [];
        if (digitGroups.length >= 3) return true;

        if (
          /^[A-Za-z0-9\u0600-\u06FF\s\-]{6,24}$/.test(value) &&
          /\d/.test(value)
        ) {
          return true;
        }

        return false;
      };

      const getShortAddressErrorMessage = (result: any) => {
        const code = String(result?.code || "").toUpperCase();
        if (code === "MISSING_KEY") {
          return t["gen.isar.create.73"];
        }
        if (code === "INVALID_KEY") {
          return t["gen.isar.create.74"];
        }
        if (code === "QUOTA_EXCEEDED") {
          return t["gen.isar.create.75"];
        }
        if (code === "BAD_REQUEST") {
          return t["gen.isar.create.76"];
        }
        if (code === "UPSTREAM_ERROR" || code === "UPSTREAM_NOT_FOUND") {
          return t["gen.isar.create.77"];
        }
        if (code === "NO_RESULT") {
          return t["gen.isar.create.78"];
        }
        return t["gen.isar.create.79"];
      };

      const lookupSaudiShortAddress = async () => {
        if (!isSaudiSelection()) return;
        const value = String(shortAddressInput?.value || "").trim();
        if (!value) {
          setShortAddressStatus(t["gen.isar.create.80"], "error");
          return;
        }

        if (!isValidSaudiShortAddress(value)) {
          setShortAddressStatus(t["gen.isar.create.81"], "error");
          return;
        }

        if (shortAddressBtn) shortAddressBtn.disabled = true;
        setShortAddressStatus(t["gen.isar.create.82"]);

        try {
          const langCode = t["gen.isar.create.83"];
          const res = await fetch(
            `/api/address/sa-short-lookup?shortAddress=${encodeURIComponent(value)}&lang=${langCode}`,
          );
          const result = await res.json();
          if (!res.ok || !result?.success || !result?.address) {
            setShortAddressStatus(getShortAddressErrorMessage(result), "error");
            return;
          }

          applySaudiAddress(result.address);
          setShortAddressStatus(t["gen.isar.create.84"], "success");
        } catch (error) {
          console.error("Saudi short address lookup failed:", error);
          setShortAddressStatus(t["gen.isar.create.85"], "error");
        } finally {
          if (shortAddressBtn) shortAddressBtn.disabled = false;
        }
      };

      if (countryInput) {
        countryInput.addEventListener("change", () => {
          const code =
            countryInput.options[countryInput.selectedIndex].dataset.code;
          if (code) {
            autocomplete.setComponentRestrictions({
              country: code.toLowerCase(),
            });
          } else {
            autocomplete.setComponentRestrictions({
              country: ["sa", "ae", "qa", "kw", "bh", "om"],
            });
          }
          toggleSaudiShortAddress();
        });
      }

      toggleSaudiShortAddress();
      shortAddressBtn?.addEventListener("click", lookupSaudiShortAddress);
      shortAddressInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          lookupSaudiShortAddress();
        }
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        if (latInput) latInput.value = String(lat);
        if (lngInput) lngInput.value = String(lng);

        const placeIdInput = document.getElementById(
          "place-id-input",
        ) as HTMLInputElement;
        const gmapsUrlInput = document.getElementById(
          "gmaps-url-input",
        ) as HTMLInputElement;
        if (placeIdInput && place.place_id) placeIdInput.value = place.place_id;
        if (gmapsUrlInput && place.url) gmapsUrlInput.value = place.url;

        applyAddressComponents(place.address_components || []);

        if (!map) {
          initMap(lat, lng);
        } else {
          if (mapWrapper) mapWrapper.classList.remove("hidden");
          const pos = { lat, lng };
          map.setCenter(pos);
          marker.setPosition(pos);
          map.setZoom(15);
        }
      });

      const latVal = latInput ? parseFloat(latInput.value) : NaN;
      const lngVal = lngInput ? parseFloat(lngInput.value) : NaN;
      if (!isNaN(latVal) && !isNaN(lngVal)) {
        initMap(latVal, lngVal);
      } else {
        initMap(24.7136, 46.6753);
      }
    };

    (window as any).initLeafletMapFallback = (lat: number, lng: number) => {
      const mapContainer = document.getElementById("map-container");
      const mapWrapper = document.getElementById("map-container-wrapper");
      if (!mapContainer) return;
      if (mapWrapper) mapWrapper.classList.remove("hidden");

      const latInput = document.getElementById("lat-input") as HTMLInputElement;
      const lngInput = document.getElementById("lng-input") as HTMLInputElement;
      const addressInput = document.getElementById(
        "address-input",
      ) as HTMLInputElement;
      const cityInput = document.getElementById(
        "city-input",
      ) as HTMLInputElement;
      const districtInput = document.getElementById(
        "district-input",
      ) as HTMLInputElement;
      const streetInput = document.getElementById(
        "street-input",
      ) as HTMLInputElement;

      const startLeaflet = () => {
        const L = (window as any).L;
        if (!L) return;

        let lMap = (window as any).leafletMap;
        let lMarker = (window as any).leafletMarker;
        if (lMap && lMap.setView) {
          try {
            lMap.setView([lat, lng], 14);
            if (lMarker && lMarker.setLatLng) lMarker.setLatLng([lat, lng]);
            setTimeout(() => lMap.invalidateSize(), 150);
            return;
          } catch (err) {
            try {
              lMap.remove();
            } catch (e) {}
          }
        }

        mapContainer.innerHTML = "";
        lMap = L.map(mapContainer).setView([lat, lng], 14);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(lMap);

        lMarker = L.marker([lat, lng], { draggable: true }).addTo(lMap);
        (window as any).leafletMap = lMap;
        (window as any).leafletMarker = lMarker;

        if (
          !(window as any).__mapResizeObserver &&
          typeof ResizeObserver !== "undefined"
        ) {
          (window as any).__mapResizeObserver = new ResizeObserver(() => {
            const gMap = (window as any).googleMap;
            const gMarker = (window as any).googleMarker;
            if (gMap && (window as any).google?.maps?.event) {
              (window as any).google.maps.event.trigger(gMap, "resize");
              if (gMarker && gMarker.getPosition)
                gMap.setCenter(gMarker.getPosition());
            }
            const leafMap = (window as any).leafletMap;
            const leafMarker = (window as any).leafletMarker;
            if (leafMap && typeof leafMap.invalidateSize === "function") {
              leafMap.invalidateSize();
              if (leafMarker && leafMarker.getLatLng) {
                leafMap.setView(
                  leafMarker.getLatLng(),
                  leafMap.getZoom() || 14,
                );
              }
            }
          });
          (window as any).__mapResizeObserver.observe(mapContainer);
        }

        const updateFromCoords = async (newLat: number, newLng: number) => {
          if (latInput) latInput.value = String(newLat);
          if (lngInput) lngInput.value = String(newLng);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&accept-language=ar`,
            );
            const data = await res.json();
            if (data && data.address) {
              if (addressInput && data.display_name)
                addressInput.value = data.display_name;
              const c =
                data.address.city ||
                data.address.town ||
                data.address.state ||
                "";
              const d =
                data.address.suburb ||
                data.address.neighbourhood ||
                data.address.county ||
                "";
              const s = data.address.road || "";
              if (cityInput && c) cityInput.value = c;
              if (districtInput && d) districtInput.value = d;
              if (streetInput && s) streetInput.value = s;
            }
          } catch (e) {}
        };

        lMarker.on("dragend", () => {
          const pos = lMarker.getLatLng();
          updateFromCoords(pos.lat, pos.lng);
        });

        lMap.on("click", (e: any) => {
          lMarker.setLatLng(e.latlng);
          updateFromCoords(e.latlng.lat, e.latlng.lng);
        });
      };

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!(window as any).L) {
        if (!document.getElementById("leaflet-js")) {
          const script = document.createElement("script");
          script.id = "leaflet-js";
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload = startLeaflet;
          document.head.appendChild(script);
        } else {
          const checkL = setInterval(() => {
            if ((window as any).L) {
              clearInterval(checkL);
              startLeaflet();
            }
          }, 100);
        }
      } else {
        startLeaflet();
      }
    };

    const runFallback = () => {
      const latEl = document.getElementById("lat-input") as HTMLInputElement;
      const lngEl = document.getElementById("lng-input") as HTMLInputElement;
      const latVal = latEl ? parseFloat(latEl.value) : NaN;
      const lngVal = lngEl ? parseFloat(lngEl.value) : NaN;
      (window as any).initLeafletMapFallback(
        !isNaN(latVal) ? latVal : 24.7136,
        !isNaN(lngVal) ? lngVal : 46.6753,
      );
    };

    (window as any).gm_authFailure = () => {
      console.warn(
        "Google Maps auth failure detected, switching to OpenStreetMap Leaflet.",
      );
      (window as any).__meamartGoogleMapsAuthFailed = true;
      runFallback();
    };

    const gmapsKeyDiv = document.getElementById("gmaps-key");
    const key = gmapsKeyDiv?.getAttribute("data-key");
    const mapsLang =
      gmapsKeyDiv?.getAttribute("data-lang") || t["gen.isar.create.86"];

    if (!key) {
      console.warn(
        "Google Maps API key is missing, using OpenStreetMap Leaflet fallback.",
      );
      runFallback();
      return;
    }

    if (
      (window as any).google?.maps?.places &&
      !(window as any).__meamartGoogleMapsAuthFailed
    ) {
      (window as any).__meamartGoogleMapsLoading = false;
      (window as any).initAutocomplete();
      return;
    }

    if ((window as any).__meamartGoogleMapsLoading) return;
    (window as any).__meamartGoogleMapsLoading = true;

    const existingScript = document.querySelector(
      'script[data-meamart-google-maps="true"]',
    ) as HTMLScriptElement | null;
    if (existingScript) {
      const waitForGoogle = () => {
        if (
          (window as any).google?.maps?.places &&
          !(window as any).__meamartGoogleMapsAuthFailed
        ) {
          (window as any).__meamartGoogleMapsLoading = false;
          (window as any).initAutocomplete();
          return;
        }
        setTimeout(waitForGoogle, 150);
      };
      waitForGoogle();
      return;
    }

    const script = document.createElement("script");
    script.dataset.meamartGoogleMaps = "true";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initAutocomplete&loading=async&libraries=places,geocoding&language=${mapsLang}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (window as any).__meamartGoogleMapsLoading = false;
      if (
        (window as any).google?.maps?.places &&
        !(window as any).__meamartGoogleMapsAuthFailed
      ) {
        (window as any).initAutocomplete();
      }
    };
    script.onerror = () => {
      (window as any).__meamartGoogleMapsLoading = false;
      console.warn(
        "Failed to load Google Maps script, using Leaflet fallback.",
      );
      runFallback();
    };
    document.head.appendChild(script);

    // Poll for maps to be ready (loading=async doesn't use callback)
    let pollCount = 0;
    const pollMaps = setInterval(() => {
      pollCount++;
      if (
        (window as any).google?.maps?.places &&
        !(window as any).__meamartGoogleMapsAuthFailed
      ) {
        clearInterval(pollMaps);
        (window as any).__meamartGoogleMapsLoading = false;
        (window as any).initAutocomplete();
      } else if (pollCount > 40) {
        clearInterval(pollMaps);
        console.warn(
          "Google Maps places library did not load in time, using Leaflet fallback.",
        );
        runFallback();
      }
    }, 250);
  };

  bootstrapGoogleMaps();
  document.addEventListener("astro:page-load", bootstrapGoogleMaps);

  // Fill in draft values if they exist & load Google Maps Autocomplete
  window.addEventListener("DOMContentLoaded", () => {
    form = document.getElementById("create-ad-form") as HTMLFormElement;

    catalogDataPromise.then(() => {
      let customFieldsDraft: Record<string, any> = {};
      let customAttributesDraft: Record<string, string> = {};

      // 1. Restore draft
      const draftStr = sessionStorage.getItem("create_ad_form_draft");
      if (draftStr) {
        try {
          const draft = JSON.parse(draftStr);
          customFieldsDraft = draft.custom_fields || {};
          customAttributesDraft = customFieldsDraft.custom_attributes || {};

          Object.entries(draft).forEach(([key, val]) => {
            if (key === "custom_fields") return;
            const field = form.elements.namedItem(key) as any;
            if (field) {
              if (field.type === "checkbox") {
                field.checked = Boolean(val);
              } else {
                field.value = String(val);
              }
            }
          });
          sessionStorage.removeItem("create_ad_form_draft");
        } catch (e) {
          console.error("Failed to parse draft form data:", e);
        }
      }

      // 2. Restore custom key-value pairs
      if (Object.keys(customAttributesDraft).length > 0) {
        Object.entries(customAttributesDraft).forEach(([key, value]) => {
          customFieldCount++;
          const fieldHtml = createCustomFieldInput(key, value);
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = fieldHtml;
          const fieldElement = tempDiv.firstElementChild as HTMLElement;
          customKeyValueContainer.appendChild(fieldElement);

          // Add remove listener
          fieldElement
            .querySelector(".remove-custom-field-btn")
            ?.addEventListener("click", () => {
              fieldElement.remove();
            });
        });
      }

      // 3. Render initial fields
      if (categorySelect) {
        renderCustomFields(categorySelect.value, customFieldsDraft);
        handleCategoryChange(categorySelect.value);
        updateCatalogVisibility(categorySelect.value);
      }
    });

    bootstrapGoogleMaps();
    switchLangBtn?.addEventListener("click", () => {
      const currentData: Record<string, any> = {};
      const formData = new FormData(form);
      formData.forEach((val, key) => {
        if (
          !(val instanceof File) &&
          !key.startsWith("custom_field_") &&
          !key.startsWith("custom_kv_")
        ) {
          currentData[key] = val;
        }
      });

      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb: any) => {
        if (!cb.name.startsWith("custom_field_")) {
          currentData[cb.name] = cb.checked;
        }
      });

      // Save customized fields draft
      const customFields: Record<string, any> = {};
      form.querySelectorAll('[name^="custom_field_"]').forEach((el: any) => {
        const key = el.name.replace("custom_field_", "");
        if (el.type === "checkbox") {
          customFields[key] = el.checked;
        } else if (el.type === "number") {
          customFields[key] = el.value ? Number(el.value) : "";
        } else {
          customFields[key] = el.value;
        }
      });

      // Collect custom key-value pairs for draft
      const customKeyValuePairs: Record<string, string> = {};
      form.querySelectorAll(".custom-kv-field").forEach((fieldEl: any) => {
        const keyInput = fieldEl.querySelector(
          '[name^="custom_kv_key_"]',
        ) as HTMLInputElement;
        const valueInput = fieldEl.querySelector(
          '[name^="custom_kv_value_"]',
        ) as HTMLInputElement;
        if (keyInput?.value && valueInput?.value) {
          customKeyValuePairs[keyInput.value] = valueInput.value;
        }
      });
      if (Object.keys(customKeyValuePairs).length > 0) {
        customFields.custom_attributes = customKeyValuePairs;
      }

      currentData.custom_fields = customFields;

      sessionStorage.setItem(
        "create_ad_form_draft",
        JSON.stringify(currentData),
      );
      const nextLang = t["gen.isar.create.88"];
      window.location.href = `/${nextLang}/ads/create`;
    });
  });

  // Native form validation hook to show red borders
  form?.addEventListener(
    "invalid",
    (e) => {
      form.classList.add("was-validated");
    },
    true,
  );

  // ─── Multi-image dropzone ────────────────────────────────────────────────
  selectedFiles = [];
  (window as any).selectedAdFiles = selectedFiles;

  const dropZone = document.getElementById("image-drop-zone") as HTMLElement;
  const imageInput = document.getElementById(
    "ad-image-input",
  ) as HTMLInputElement;
  const placeholder = document.getElementById(
    "drop-placeholder",
  ) as HTMLElement;
  const previewGrid = document.getElementById("image-previews") as HTMLElement;
  const addMoreBtn = document.getElementById(
    "add-more-photos-btn",
  ) as HTMLButtonElement;
  const noImageCheckbox = document.getElementById(
    "no-image-checkbox",
  ) as HTMLInputElement;

  function renderPreviews() {
    if (selectedFiles.length === 0) {
      placeholder.classList.remove("hidden");
      previewGrid.classList.add("hidden");
      addMoreBtn.classList.add("hidden");
      return;
    }
    placeholder.classList.add("hidden");
    previewGrid.classList.remove("hidden");
    addMoreBtn.classList.remove("hidden");
    previewGrid.innerHTML = "";
    selectedFiles.forEach((file, idx) => {
      const url = URL.createObjectURL(file);
      const item = document.createElement("div");
      item.className =
        "relative group rounded-2x1 overflow-hidden aspect-square bg-zinc-100 dark:bg-zinc-800";
      item.innerHTML = `
        <img src="${url}" class="w-full h-full object-cover" />
        ${idx === 0 ? `<span class="absolute top-1 start-1 text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-md">${t["gen.isar.create.89"]}</span>` : ""}
        <button type="button" data-idx="${idx}" class="remove-img-btn absolute top-1 end-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">&times;</button>
      `;
      previewGrid.appendChild(item);
    });
    // Remove buttons
    previewGrid.querySelectorAll(".remove-img-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = Number((e.currentTarget as HTMLElement).dataset.idx);
        selectedFiles.splice(idx, 1);
        renderPreviews();
      });
    });
  }

  function addFiles(files: FileList | File[]) {
    const errDiv = document.getElementById("credibility-alert");
    if (errDiv) errDiv.remove();

    Array.from(files).forEach((f) => {
      if (f.type.startsWith("image/")) selectedFiles.push(f);
    });
    renderPreviews();
    if (selectedFiles.length > 0) noImageCheckbox.checked = false;
  }

  imageInput?.addEventListener("change", () => {
    if (imageInput.files) addFiles(imageInput.files);
  });

  // Drag & drop
  dropZone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("border-primary");
  });
  dropZone?.addEventListener("dragleave", () => {
    dropZone.classList.remove("border-primary");
  });
  dropZone?.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    dropZone.classList.remove("border-primary");
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
  });

  // Add more button - retrigger file input
  addMoreBtn?.addEventListener("click", () => imageInput?.click());

  // No-image checkbox hides dropzone
  noImageCheckbox?.addEventListener("change", () => {
    if (noImageCheckbox.checked) {
      dropZone.style.opacity = "0.4";
      dropZone.style.pointerEvents = "none";
      selectedFiles.length = 0;
      renderPreviews();
    } else {
      dropZone.style.opacity = "1";
      dropZone.style.pointerEvents = "auto";
    }
  });

  // Video primary toggle
  const videoUrlInput = document.getElementById(
    "video-url-input",
  ) as HTMLInputElement;
  const videoPrimaryWrap = document.getElementById(
    "video-primary-wrap",
  ) as HTMLElement;
  videoUrlInput?.addEventListener("input", () => {
    if (videoUrlInput.value.trim()) {
      videoPrimaryWrap.classList.remove("hidden");
    } else {
      videoPrimaryWrap.classList.add("hidden");
      (
        document.getElementById("video-primary-checkbox") as HTMLInputElement
      ).checked = false;
    }
  });

  // Form Submit Event Listener
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.classList.add("was-validated");
    const publishButtonText = t["gen.isar.create.90"];
    const successMessage = t["gen.isar.create.91"];
    const errorMessage = t["gen.isar.create.92"];

    submitBtn.disabled = true;
    submitBtn.textContent = "...";

    const advertiserRole = (form.querySelector('input[name="advertiser_role"]:checked') as HTMLInputElement)?.value;
    const addToCatalog = (document.getElementById("add-to-catalog-checkbox") as HTMLInputElement)?.checked;

    if (advertiserRole === "company" && addToCatalog) {
      const prodName = (document.getElementById("prod-name-input") as HTMLInputElement)?.value.trim();
      const prodSku = (document.getElementById("prod-sku-input") as HTMLInputElement)?.value.trim();
      const prodPrice = (document.getElementById("prod-price-input") as HTMLInputElement)?.value.trim();
      const prodBrand = (document.getElementById("prod-brand-input") as HTMLInputElement)?.value.trim();
      const prodDesc = (document.getElementById("prod-desc-input") as HTMLTextAreaElement)?.value.trim();

      if (!prodName || !prodSku || !prodPrice) {
        alert(isAr ? "يرجى ملء جميع حقول المنتج المطلوبة بالكاتالوج (الاسم، الرمز، السعر)" : "Please fill all required catalog product fields (Name, SKU, Price)");
        submitBtn.disabled = false;
        submitBtn.textContent = publishButtonText;
        return;
      }

      try {
        const prodRes = await fetch("/api/products/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: prodName,
            sku: prodSku,
            regular_price: Number(prodPrice),
            brand: prodBrand,
            description: prodDesc,
            type: "simple"
          })
        });
        const prodData = await prodRes.json();
        if (!prodData.success) {
          throw new Error(prodData.error || "Failed to create product");
        }
        // Catalog product created successfully, but we no longer link it directly via linked_product_id since the column does not exist.
      } catch (prodErr: any) {
        console.error("Catalog creation error:", prodErr);
        alert(isAr ? `فشل حفظ المنتج بالكاتالوج: ${prodErr.message}` : `Failed to save product to catalog: ${prodErr.message}`);
        submitBtn.disabled = false;
        submitBtn.textContent = publishButtonText;
        return;
      }
    }

    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((val, key) => {
      if (
        !key.startsWith("custom_field_") &&
        !key.startsWith("custom_kv_") &&
        !key.endsWith("_code") &&
        !key.endsWith("_number")
      ) {
        data[key] = val;
      }
    });

    data.contact_method = "whatsapp";
    delete data.contact_phone;


    const whatsappCode =
      (form.elements.namedItem("contact_whatsapp_code") as any)?.value || "";
    const whatsappNum =
      (form.elements.namedItem("contact_whatsapp_number") as any)?.value || "";
    if (whatsappCode && whatsappNum)
      data.contact_whatsapp = whatsappCode + whatsappNum;

    const tagsField = form.querySelector(
      '[name="listing_tags"]',
    ) as HTMLInputElement;
    if (tagsField?.value) {
      data.tags = tagsField.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    // Inject profile metadata from LocalStorage if available
    try {
      const profileDataStr = localStorage.getItem("meamart_profile_data");
      if (profileDataStr) {
        const profile = JSON.parse(profileDataStr);
        data.seller_avatar = profile.seller_avatar || "";
        data.seller_banner = profile.seller_banner || "";
        data.seller_instagram = profile.seller_instagram || "";
        data.seller_facebook = profile.seller_facebook || "";
        data.seller_telegram = profile.seller_telegram || "";
        data.seller_website = profile.seller_website || "";
        data.seller_gmaps = profile.seller_gmaps || "";
      }
    } catch (e) {
      console.error("Failed to inject local profile details:", e);
    }

    const customFields: Record<string, any> = {};
    form.querySelectorAll('[name^="custom_field_"]').forEach((el: any) => {
      const key = el.name.replace("custom_field_", "");
      if (el.type === "checkbox") {
        customFields[key] = el.checked;
      } else if (el.type === "number") {
        customFields[key] = el.value ? Number(el.value) : "";
      } else {
        customFields[key] = el.value;
      }
    });

    // Collect custom key-value pairs
    const customKeyValuePairs: Record<string, string> = {};
    form.querySelectorAll(".custom-kv-field").forEach((fieldEl: any) => {
      const keyInput = fieldEl.querySelector(
        '[name^="custom_kv_key_"]',
      ) as HTMLInputElement;
      const valueInput = fieldEl.querySelector(
        '[name^="custom_kv_value_"]',
      ) as HTMLInputElement;
      if (keyInput?.value && valueInput?.value) {
        customKeyValuePairs[keyInput.value] = valueInput.value;
      }
    });
    if (Object.keys(customKeyValuePairs).length > 0) {
      customFields.custom_attributes = customKeyValuePairs;
    }

    data.custom_fields = customFields;

    // ── Read image files or generate screenshot ──────────────────────────────
    const noImgChecked = (
      document.getElementById("no-image-checkbox") as HTMLInputElement
    )?.checked;

    const condSelect = form.querySelector(
      '[name="listing_condition"]',
    ) as HTMLSelectElement;
    const condVal = condSelect?.value || "";
    const categorySelectEl = form.querySelector('[name="categoryKey"]') as HTMLSelectElement;
    const parentCatKey = typeof getParentCategoryKey === "function" ? getParentCategoryKey(categorySelectEl?.value || "") : "";
    const hideConditionForCategories = ["jobs", "services", "real-estate", "places-venues", "travel-tourism", "delivery-shipping", "food-home-kitchens"];
    const isConditionApplicable = Boolean(condSelect) && condVal !== "" && !hideConditionForCategories.includes(parentCatKey);

    if (isConditionApplicable && (condVal === "used" || condVal === "مستعمل" || condVal.toLowerCase() === "used") && selectedFiles.length === 0) {

      const dropZone = document.getElementById("image-drop-zone");
      if (dropZone) {
        let errDiv = document.getElementById("credibility-alert");
        if (!errDiv) {
          errDiv = document.createElement("div");
          errDiv.id = "credibility-alert";
          errDiv.className = "text-red-500 text-sm font-bold mt-3 bg-red-500/10 p-3 rounded-lg border border-red-500/20";
          dropZone.parentElement?.appendChild(errDiv);
        }
        errDiv.textContent = "إلزامي للمصداقية: المنتج محدد بحالة (مستعمل). يرجى إرفاق صور حقيقية للسلعة التي لديك قبل النشر.";
        errDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert(
          "إلزامي للمصداقية: المنتج محدد بحالة (مستعمل). يرجى إرفاق صور حقيقية للسلعة التي لديك قبل النشر.",
        );
      }
      submitBtn.disabled = false;
      submitBtn.textContent = publishButtonText;
      return;
    }

    if (
      condVal === "new" &&
      selectedFiles.length === 0 &&
      (window as any).__catalogPrefillImages?.length > 0
    ) {
      data.catalogImages = (window as any).__catalogPrefillImages;
    }

    if (selectedFiles.length > 0) {
      // Multiple images: read all as base64
      const readFile = (file: File) =>
        new Promise<{ name: string; type: string; base64: string }>(
          (resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                base64: (reader.result as string).split(",")[1],
              });
            };
            reader.readAsDataURL(file);
          },
        );
      const allFiles = await Promise.all(selectedFiles.map(readFile));
      // First file = imageFile (main), rest in imageFiles array
      data.imageFile = allFiles[0];
      data.imageFiles = allFiles;
    } else if (noImgChecked || selectedFiles.length === 0) {
      // ── Generate Canvas-based card ──────────────────────────────────────────
      try {
        const title =
          (form.elements.namedItem("listing_title") as HTMLInputElement)
            ?.value || "";
        const desc =
          (
            form.elements.namedItem(
              "listing_description",
            ) as HTMLTextAreaElement
          )?.value || "";
        const priceVal =
          (form.elements.namedItem("listing_price") as HTMLInputElement)
            ?.value || "0";
        const currency =
          (form.elements.namedItem("listing_currency") as HTMLSelectElement)
            ?.value || "SAR";
        const sellerName =
          (form.elements.namedItem("contact_name") as HTMLInputElement)
            ?.value || "";

        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 675; // Exactly 16:9 aspect ratio
        const ctx = canvas.getContext("2d")!;

        const rtl = isAr; // Use context direction

        // 1. Background
        const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
        bgGrad.addColorStop(0, "#0b1220");
        bgGrad.addColorStop(0.52, "#0f172a");
        bgGrad.addColorStop(1, "#111827");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1200, 675);

        // 2. Elegant Inner Rounded Border
        ctx.strokeStyle = "rgba(148, 163, 184, 0.32)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(40, 40, 1120, 595, 36);
        ctx.stroke();

        // Text wrapping function helper
        function wrapText(
          text: string,
          x: number,
          y: number,
          maxWidth: number,
          lineHeight: number,
          maxLines: number,
          fontSize: number,
          color: string,
          isBold: boolean,
        ) {
          ctx.font = `${isBold ? "bold" : "normal"} ${fontSize}px "Noto Kufi Arabic", "Noto Kufi Arabic", system-ui, sans-serif`;
          ctx.fillStyle = color;
          ctx.textAlign = rtl ? "right" : "left";
          ctx.textBaseline = "top";

          const words = text.split(" ");
          let line = "";
          let lines: string[] = [];

          for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            let metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
              lines.push(line.trim());
              line = words[n] + " ";
            } else {
              line = testLine;
            }
          }
          lines.push(line.trim());

          if (maxLines && lines.length > maxLines) {
            lines = lines.slice(0, maxLines);
            lines[lines.length - 1] = lines[lines.length - 1] + "...";
          }

          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + i * lineHeight);
          }
          return lines.length * lineHeight;
        }

        // 3. Listing Title (Bold White)
        const textX = rtl ? 1120 : 80;
        const titleY = 96;
        const maxTextW = 1040;
        const titleHeight = wrapText(
          title || (rtl ? "عنوان الإعلان" : "Ad Title"),
          textX,
          titleY,
          maxTextW,
          68,
          2,
          48,
          "#ffffff",
          true,
        );

        // 4. Listing Description (Muted zinc)
        const descY = titleY + titleHeight + 25;
        const displayDesc =
          desc ||
          (rtl
            ? "تفاصيل الإعلان ووصف المنتج..."
            : "No description provided...");
        wrapText(
          displayDesc,
          textX,
          descY,
          maxTextW,
          40,
          3,
          26,
          "#a1a1aa",
          false,
        );

        // 5. Divider Line
        const dividerY = 485;
        ctx.strokeStyle = "rgba(63, 63, 70, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(80, dividerY);
        ctx.lineTo(1120, dividerY);
        ctx.stroke();

        // 6. Seller Profile & Avatar (Bottom Left for LTR, Bottom Right for RTL)
        const sellerY = 515;
        const avatarX = rtl ? 1120 - 70 : 80;
        const avatarY = sellerY;

        // Avatar Circle
        const avatarRadius = 35;
        const avatarCenterX = avatarX + avatarRadius;
        const avatarCenterY = avatarY + avatarRadius;
        ctx.fillStyle = "rgba(56, 189, 248, 0.2)";
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.fill();

        // Avatar Letter
        ctx.fillStyle = "#7dd3fc";
        ctx.font =
          'bold 34px "Noto Kufi Arabic", "Noto Kufi Arabic", system-ui, sans-serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const avatarChar = sellerName
          ? sellerName.trim().charAt(0).toUpperCase()
          : rtl
            ? "م"
            : "M";
        ctx.fillText(avatarChar, avatarCenterX, avatarCenterY);

        // Seller Name
        ctx.textAlign = rtl ? "right" : "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#f4f4f5";
        ctx.font =
          'bold 26px "Noto Kufi Arabic", "Noto Kufi Arabic", system-ui, sans-serif';
        const nameX = rtl ? avatarX - 20 : avatarX + 70 + 20;
        ctx.fillText(
          sellerName || (rtl ? "المعلن" : "Seller"),
          nameX,
          sellerY + 35,
        );

        // 7. Price (Bottom Right for LTR, Bottom Left for RTL)
        let currencyStr = currency;
        if (currency === "SAR") currencyStr = "﷼";
        else if (currency === "USD") currencyStr = "$";
        else if (currency === "EUR") currencyStr = "€";

        const priceValStr = Number(priceVal).toLocaleString();
        const fullPriceText = rtl
          ? `${currencyStr} ${priceValStr}`
          : `${priceValStr} ${currencyStr}`;
        const priceLabelText = rtl ? "السعر" : "Price";

        ctx.font =
          'bold 30px "Noto Kufi Arabic", "Noto Kufi Arabic", system-ui, sans-serif';
        const priceTextMetrics = ctx.measureText(fullPriceText);
        ctx.font =
          'normal 14px "Noto Kufi Arabic", "Noto Kufi Arabic", system-ui, sans-serif';
        const priceLabelMetrics = ctx.measureText(priceLabelText);

        const priceX = rtl
          ? 80
          : 1120 - Math.max(priceTextMetrics.width, priceLabelMetrics.width);
        const priceY = 520;

        // Price Label text
        ctx.fillStyle = "#94a3b8";
        ctx.font =
          '600 14px "Noto Kufi Arabic", "Noto Kufi Arabic", system-ui, sans-serif';
        ctx.textAlign = rtl ? "left" : "right";
        ctx.textBaseline = "top";
        ctx.fillText(priceLabelText, priceX, priceY + 2);

        // Price Value text
        ctx.fillStyle = "#38bdf8";
        ctx.font =
          'bold 50px "Noto Kufi Arabic", "Noto Kufi Arabic", system-ui, sans-serif';
        ctx.textBaseline = "alphabetic";
        ctx.fillText(fullPriceText, priceX, priceY + 72);

        // Convert canvas to jpeg base64
        const base64 = canvas.toDataURL("image/jpeg", 0.92).split(",")[1];
        data.imageFile = { name: "ad-card.jpg", type: "image/jpeg", base64 };
      } catch (snapErr) {
        console.warn(
          "Canvas card generation failed, sending without image:",
          snapErr,
        );
      }
    }

    try {
      const response = await fetch("/api/create-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (resData.success) {
        // If delivery service is enabled, save it
        if (offersDeliveryCheckbox && offersDeliveryCheckbox.checked) {
          const scopeVal = (document.getElementById("delivery-scope-select") as HTMLSelectElement)?.value || "ad";
          const vehicleVal = (document.getElementById("delivery-vehicle-input") as HTMLInputElement)?.value.trim() || "";
          const citiesVal = (document.getElementById("delivery-cities-input") as HTMLInputElement)?.value.split(",").map(c => c.trim()).filter(Boolean) || [];

          const deliveryTypes: string[] = [];
          document.querySelectorAll('input[name="delivery_type"]:checked').forEach((el: any) => {
            deliveryTypes.push(el.value);
          });

          const deliveryFeatures: string[] = [];
          document.querySelectorAll('input[name="delivery_features"]:checked').forEach((el: any) => {
            deliveryFeatures.push(el.value);
          });

          try {
            await fetch("/api/delivery/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                associated_ad_id: resData.postId || resData.slug,
                scope: scopeVal,
                delivery_type: deliveryTypes,
                vehicle_type: vehicleVal,
                coverage_cities: citiesVal,
                additional_features: deliveryFeatures,
                is_active: true
              })
            });
          } catch (delErr) {
            console.error("Failed to save delivery configurations:", delErr);
          }
        }

        statusDiv.className =
          "p-4 mb-6 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
        const serviceOrderText = resData.orderNumber
          ? t["gen.isar.create.93"]
          : "";
        const paymentRedirectText = resData.paymentUrl
          ? t["gen.isar.create.94"]
          : "";
        statusDiv.textContent = [
          successMessage,
          serviceOrderText,
          paymentRedirectText,
        ]
          .filter(Boolean)
          .join(" ");
        statusDiv.classList.remove("hidden");
        statusDiv.scrollIntoView({ behavior: "smooth", block: "center" });
        form.reset();
        form.classList.remove("was-validated");

        setTimeout(() => {
          if (resData.paymentUrl) {
            window.location.href = String(resData.paymentUrl);
            return;
          }
          window.location.href = `/${t["gen.isar.create.95"]}/seller/dashboard`;
        }, 2000);
      } else {
        throw new Error(resData.error || "Request failed");
      }
    } catch (err: any) {
      statusDiv.className =
        "p-4 mb-6 rounded-full text-sm font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      statusDiv.textContent = `${errorMessage} ${err.message}`;
      statusDiv.classList.remove("hidden");
      statusDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = publishButtonText;
    }
  });

  // ── Auto-Prefill from Catalog & Saved User Profile ─────────────────────────
  window.addEventListener("DOMContentLoaded", () => {
    try {
      const catalogPrefillRaw = sessionStorage.getItem("catalog_prefill_ad");
      if (catalogPrefillRaw) {
        const catalogData = JSON.parse(catalogPrefillRaw);
        applySafePrefill({
          knownData: catalogData,
          apply_safe_prefill: {
            title: true,
            description: true,
            price: true,
            listing_condition: true,
            categoryKey: true,
          },
        });
        if (catalogData.images && catalogData.images.length > 0) {
          (window as any).__catalogPrefillImages = catalogData.images;
        }
      }

      // Automatically fill Name/WhatsApp if user has them saved in session cookie
      const sessionCookie = getCookie("meamart_session");
      if (sessionCookie) {
        const sData = JSON.parse(decodeURIComponent(sessionCookie));
        if (sData) {
          const nameInput = form.querySelector(
            '[name="contact_name"]',
          ) as HTMLInputElement;
          const whatsappInput = form.querySelector(
            '[name="contact_whatsapp_number"]',
          ) as HTMLInputElement;
          if (nameInput && !nameInput.value && (sData.name || sData.fullName)) {
            nameInput.value = sData.name || sData.fullName;
            nameInput.dispatchEvent(new Event("input"));
          }
          if (
            whatsappInput &&
            !whatsappInput.value &&
            (sData.whatsapp || sData.phone)
          ) {
            let cleanWa = String(sData.whatsapp || sData.phone).replace(
              /^\+\d{1,3}/,
              "",
            );
            whatsappInput.value = cleanWa;
            whatsappInput.dispatchEvent(new Event("input"));
          }
        }
      }
    } catch (e) {
      console.warn("Catalog auto prefill error:", e);
    }
  });
