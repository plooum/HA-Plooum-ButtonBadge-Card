import { LitElement, html, css } from "lit";

/* ==========================================================================
   CARTE PRINCIPALE : ha-plooum-buttonbadge-card
   ========================================================================== */
class HaPlooumButtonBadgeCard extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      config: { type: Object },
    };
  }

  static getConfigElement() {
    return document.createElement("ha-plooum-buttonbadge-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      name: "Mon Bouton",
      icon: "mdi:lightbulb",
      active_color: "#fff176",
      inactive_color: "#ffffff",
      tap_action_type: "toggle",
      hold_action_type: "none",
      badge_tap_action_type: "toggle",
      badge_hold_action_type: "none",
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Configuration invalide");
    }
    this.config = { ...config };
  }

  // --- Gestionnaire d'actions ---
  _handleAction(actionPrefix, defaultEntity) {
    const actionType = this.config[`${actionPrefix}_type`] || "toggle";

    if (actionType === "toggle" && defaultEntity) {
      const domain = defaultEntity.split(".")[0];
      this.hass.callService(domain, "toggle", { entity_id: defaultEntity });
    } 
    else if (actionType === "navigate") {
      const path = this.config[`${actionPrefix}_path`];
      if (path) {
        window.history.pushState(null, "", path);
        window.dispatchEvent(new CustomEvent("location-changed"));
      }
    } 
    else if (actionType === "execute_script") {
      const scriptEntity = this.config[`${actionPrefix}_script`];
      if (scriptEntity) {
        const scriptId = scriptEntity.replace("script.", "");
        this.hass.callService("script", scriptId);
      }
    }
  }

  // --- Événements Clic / Clic Long ---
  _startTimer(e, target) {
    this.longPress = false;
    this.timer = setTimeout(() => {
      this.longPress = true;
      const actionPrefix = target === 'badge' ? 'badge_hold_action' : 'hold_action';
      const entity = target === 'badge' ? this.config.badge_entity : this.config.entity;
      this._handleAction(actionPrefix, entity);
    }, 500);
  }

  _stopTimer(e, target) {
    clearTimeout(this.timer);
    if (!this.longPress) {
      const actionPrefix = target === 'badge' ? 'badge_tap_action' : 'tap_action';
      const entity = target === 'badge' ? this.config.badge_entity : this.config.entity;
      this._handleAction(actionPrefix, entity);
    }
  }

  render() {
    if (!this.config || !this.hass) return html``;

    // -- Calculs Bouton Principal --
    const stateObj = this.config.entity ? this.hass.states[this.config.entity] : undefined;
    const isActive = stateObj && stateObj.state !== "off" && stateObj.state !== "unavailable";
    
    const color = isActive 
      ? (this.config.active_color || "#fff176") 
      : (this.config.inactive_color || "#ffffff");

    const showIcon = !!this.config.icon;
    const showName = !!this.config.name;
    const justifyContent = (showIcon && showName) ? "flex-start" : "center";

    // -- Calculs Badge --
    const hasBadge = !!(this.config.badge_entity || this.config.badge_icon);
    let badgeHtml = html``;

    if (hasBadge) {
      const badgeStateObj = this.config.badge_entity ? this.hass.states[this.config.badge_entity] : undefined;
      const isBadgeActive = badgeStateObj && badgeStateObj.state !== "off" && badgeStateObj.state !== "unavailable";
      const badgeBgColor = isBadgeActive 
        ? (this.config.badge_active_color || "#ffa726") 
        : (this.config.badge_inactive_color || "rgba(255, 255, 255, 0.25)");

      badgeHtml = html`
        <div class="badge" 
             style="background: ${badgeBgColor};"
             @mousedown="${(e) => { e.stopPropagation(); this._startTimer(e, 'badge'); }}"
             @mouseup="${(e) => { e.stopPropagation(); this._stopTimer(e, 'badge'); }}"
             @touchstart="${(e) => { e.stopPropagation(); this._startTimer(e, 'badge'); }}"
             @touchend="${(e) => { e.stopPropagation(); this._stopTimer(e, 'badge'); }}">
          ${this.config.badge_icon ? html`<ha-icon icon="${this.config.badge_icon}"></ha-icon>` : ""}
        </div>
      `;
    }

    return html`
      <ha-card class="plooum-card"
               @mousedown="${(e) => this._startTimer(e, 'main')}"
               @mouseup="${(e) => this._stopTimer(e, 'main')}"
               @touchstart="${(e) => this._startTimer(e, 'main')}"
               @touchend="${(e) => this._stopTimer(e, 'main')}">
        
        <div class="content" style="justify-content: ${justifyContent};">
          ${showIcon ? html`<ha-icon icon="${this.config.icon}" style="color: ${color};"></ha-icon>` : ""}
          ${showName ? html`<span style="color: ${color};">${this.config.name}</span>` : ""}
        </div>

        ${badgeHtml}
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      .plooum-card {
        background: rgba(0, 0, 0, 0.35);
        border-radius: 20px;
        padding: 4px 10px 4px 6px;
        box-shadow: none;
        border: none;
        position: relative;
        height: 56px;
        overflow: visible;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
      }
      .content {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        gap: 10px;
      }
      .content ha-icon {
        --mdc-icon-size: 28px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .content span {
        font-size: 14px;
        font-weight: 700;
        text-align: center;
        flex-grow: 1;
      }
      .badge {
        position: absolute;
        top: -5px;
        right: -5px;
        z-index: 2;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      .badge ha-icon {
        --mdc-icon-size: 16px;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
      }
    `;
  }
}

/* ==========================================================================
   ÉDITEUR DE CARTE (CORRIGÉ & COMPATIBLE)
   ========================================================================== */
class HaPlooumButtonBadgeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadHAElements();
  }

  async _loadHAElements() {
    if (customElements.get("ha-entity-picker")) return;

    if (window.loadCardHelpers) {
      const helpers = await window.loadCardHelpers();
      if (helpers) {
        await helpers.createCardElement({ type: "button" });
        this.requestUpdate();
      }
    }
  }

  setConfig(config) {
    this._config = config;
  }

  _valueChanged(ev, key) {
    if (!this._config || !this.hass) return;
    
    let newValue;
    if (ev.detail && ev.detail.value !== undefined) {
      newValue = ev.detail.value;
    } else if (ev.target && ev.target.value !== undefined) {
      newValue = ev.target.value;
    }

    if (this._config[key] === newValue) return;

    const newConfig = {
      ...this._config,
      [key]: newValue,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }

  _renderActionConfig(actionPrefix, labelTitle) {
    const typeKey = `${actionPrefix}_type`;
    const pathKey = `${actionPrefix}_path`;
    const scriptKey = `${actionPrefix}_script`;

    const actionType = this._config[typeKey] || "toggle";

    return html`
      <div class="action-group">
        <h4>${labelTitle}</h4>
        <select
          .value=${actionType}
          @change=${(e) => this._valueChanged(e, typeKey)}
        >
          <option value="toggle">Toggle (Inverser entité)</option>
          <option value="navigate">Naviguer</option>
          <option value="execute_script">Exécuter un script</option>
          <option value="none">Aucune action</option>
        </select>

        ${actionType === "navigate"
          ? html`
              <div class="input-field">
                <label>Chemin de navigation (ex: /lovelace/entree)</label>
                <input
                  type="text"
                  .value=${this._config[pathKey] || ""}
                  @input=${(e) => this._valueChanged(e, pathKey)}
                />
              </div>
            `
          : ""}

        ${actionType === "execute_script"
          ? html`
              <ha-entity-picker
                .label=${"Script à exécuter"}
                .hass=${this.hass}
                .value=${this._config[scriptKey] || ""}
                .includeDomains=${["script"]}
                @value-changed=${(e) => this._valueChanged(e, scriptKey)}
                allow-custom-entity
              ></ha-entity-picker>
            `
          : ""}
      </div>
    `;
  }

  render() {
    if (!this.hass || !this._config) return html``;

    return html`
      <div class="card-config">
        <h3>Bouton Principal</h3>
        
        <ha-entity-picker
          .label=${"Entité principale"}
          .hass=${this.hass}
          .value=${this._config.entity || ""}
          @value-changed=${(e) => this._valueChanged(e, "entity")}
          allow-custom-entity
        ></ha-entity-picker>

        <div class="input-field">
          <label>Texte du bouton</label>
          <input
            type="text"
            placeholder="Nom affiché sur le bouton"
            .value=${this._config.name || ""}
            @input=${(e) => this._valueChanged(e, "name")}
          />
        </div>

        <ha-icon-picker
          .label=${"Icône principale"}
          .hass=${this.hass}
          .value=${this._config.icon || ""}
          @value-changed=${(e) => this._valueChanged(e, "icon")}
        ></ha-icon-picker>

        <div class="input-field">
          <label>Couleur actif (ex: #fff176)</label>
          <input
            type="text"
            .value=${this._config.active_color || ""}
            @input=${(e) => this._valueChanged(e, "active_color")}
          />
        </div>

        <div class="input-field">
          <label>Couleur inactif (ex: #ffffff)</label>
          <input
            type="text"
            .value=${this._config.inactive_color || ""}
            @input=${(e) => this._valueChanged(e, "inactive_color")}
          />
        </div>

        ${this._renderActionConfig("tap_action", "Action au clic (Bouton)")}
        ${this._renderActionConfig("hold_action", "Action clic long (Bouton)")}

        <hr />

        <h3>Badge (Optionnel)</h3>

        <ha-entity-picker
          .label=${"Entité du badge"}
          .hass=${this.hass}
          .value=${this._config.badge_entity || ""}
          @value-changed=${(e) => this._valueChanged(e, "badge_entity")}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-icon-picker
          .label=${"Icône du badge"}
          .hass=${this.hass}
          .value=${this._config.badge_icon || ""}
          @value-changed=${(e) => this._valueChanged(e, "badge_icon")}
        ></ha-icon-picker>

        <div class="input-field">
          <label>Couleur fond badge actif (ex: #ffa726)</label>
          <input
            type="text"
            .value=${this._config.badge_active_color || ""}
            @input=${(e) => this._valueChanged(e, "badge_active_color")}
          />
        </div>

        <div class="input-field">
          <label>Couleur fond badge inactif</label>
          <input
            type="text"
            .value=${this._config.badge_inactive_color || ""}
            @input=${(e) => this._valueChanged(e, "badge_inactive_color")}
          />
        </div>

        ${this._renderActionConfig("badge_tap_action", "Action au clic (Badge)")}
        ${this._renderActionConfig("badge_hold_action", "Action clic long (Badge)")}
      </div>
    `;
  }

  static get styles() {
    return css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 0;
      }
      h3 {
        margin: 12px 0 4px 0;
        font-size: 1.1em;
        color: var(--primary-text-color);
      }
      h4 {
        margin: 4px 0;
        font-size: 0.95em;
        color: var(--secondary-text-color);
      }
      .input-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .input-field label {
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      input[type="text"],
      select {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, #ccc);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #000);
        box-sizing: border-box;
        font-size: 14px;
      }
      ha-entity-picker,
      ha-icon-picker {
        width: 100%;
        display: block;
      }
      .action-group {
        border-left: 3px solid var(--primary-color);
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 4px;
      }
      hr {
        border: none;
        border-top: 1px solid var(--divider-color);
        margin: 16px 0;
      }
    `;
  }
}

/* ==========================================================================
   ENREGISTREMENTS HOME ASSISTANT
   ========================================================================== */
if (!customElements.get('ha-plooum-buttonbadge-card')) {
  customElements.define('ha-plooum-buttonbadge-card', HaPlooumButtonBadgeCard);
}
if (!customElements.get('ha-plooum-buttonbadge-card-editor')) {
  customElements.define('ha-plooum-buttonbadge-card-editor', HaPlooumButtonBadgeCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === 'ha-plooum-buttonbadge-card')) {
  window.customCards.push({
    type: 'ha-plooum-buttonbadge-card',
    name: 'Ha Plooum Button Badge Card',
    description: 'A custom button card to show a custom badge on it.',
    preview: true,
  });
}