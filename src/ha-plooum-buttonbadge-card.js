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
        width: 30px;
        height: 30px;
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
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }
      .badge ha-icon {
        width: 19px;
        height: 19px;
        color: #ffffff;
      }
    `;
  }
}

/* ==========================================================================
   ÉDITEUR DE CARTE (UTILISANT LES COMPOSANTS NATIFS HA)
   ========================================================================== */
class HaPlooumButtonBadgeCardEditor extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
    };
  }

  setConfig(config) {
    this._config = config;
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;
    
    const target = ev.target;
    const configValue = target.configValue;
    if (!configValue) return;

    let newValue;
    if (ev.detail && ev.detail.value !== undefined) {
      newValue = ev.detail.value;
    } else if (target.value !== undefined) {
      newValue = target.value;
    }

    if (this._config[configValue] === newValue) return;

    const newConfig = {
      ...this._config,
      [configValue]: newValue,
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
          .configValue=${typeKey}
          @change=${this._valueChanged}
        >
          <option value="toggle">Toggle (Inverser entité)</option>
          <option value="navigate">Naviguer</option>
          <option value="execute_script">Exécuter un script</option>
          <option value="none">Aucune action</option>
        </select>

        ${actionType === "navigate"
          ? html`
              <ha-textfield
                .label=${"Chemin (ex: /lovelace/entree)"}
                .value=${this._config[pathKey] || ""}
                .configValue=${pathKey}
                @input=${this._valueChanged}
              ></ha-textfield>
            `
          : ""}

        ${actionType === "execute_script"
          ? html`
              <ha-entity-picker
                .label=${"Script à exécuter"}
                .hass=${this.hass}
                .value=${this._config[scriptKey] || ""}
                .configValue=${scriptKey}
                .includeDomains=${["script"]}
                @value-changed=${this._valueChanged}
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
        
        <!-- Sélecteur d'entité principal -->
        <ha-entity-picker
          .label=${"Entité principale"}
          .hass=${this.hass}
          .value=${this._config.entity || ""}
          .configValue=${"entity"}
          @value-changed=${this._valueChanged}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-textfield
          .label=${"Texte affiché"}
          .value=${this._config.name || ""}
          .configValue=${"name"}
          @input=${this._valueChanged}
        ></ha-textfield>

        <!-- Sélecteur d'icône principal -->
        <ha-icon-picker
          .label=${"Icône principale"}
          .hass=${this.hass}
          .value=${this._config.icon || ""}
          .configValue=${"icon"}
          @value-changed=${this._valueChanged}
        ></ha-icon-picker>

        <ha-textfield
          .label=${"Couleur actif (ex: #fff176)"}
          .value=${this._config.active_color || ""}
          .configValue=${"active_color"}
          @input=${this._valueChanged}
        ></ha-textfield>

        <ha-textfield
          .label=${"Couleur inactif (ex: #ffffff)"}
          .value=${this._config.inactive_color || ""}
          .configValue=${"inactive_color"}
          @input=${this._valueChanged}
        ></ha-textfield>

        <!-- Actions du bouton -->
        ${this._renderActionConfig("tap_action", "Action au clic (Bouton)")}
        ${this._renderActionConfig("hold_action", "Action clic long (Bouton)")}

        <hr />

        <h3>Badge (Optionnel)</h3>

        <!-- Sélecteur d'entité du badge -->
        <ha-entity-picker
          .label=${"Entité du badge"}
          .hass=${this.hass}
          .value=${this._config.badge_entity || ""}
          .configValue=${"badge_entity"}
          @value-changed=${this._valueChanged}
          allow-custom-entity
        ></ha-entity-picker>

        <!-- Sélecteur d'icône du badge -->
        <ha-icon-picker
          .label=${"Icône du badge"}
          .hass=${this.hass}
          .value=${this._config.badge_icon || ""}
          .configValue=${"badge_icon"}
          @value-changed=${this._valueChanged}
        ></ha-icon-picker>

        <ha-textfield
          .label=${"Couleur badge actif (ex: #ffa726)"}
          .value=${this._config.badge_active_color || ""}
          .configValue=${"badge_active_color"}
          @input=${this._valueChanged}
        ></ha-textfield>

        <ha-textfield
          .label=${"Couleur badge inactif"}
          .value=${this._config.badge_inactive_color || ""}
          .configValue=${"badge_inactive_color"}
          @input=${this._valueChanged}
        ></ha-textfield>

        <!-- Actions du badge -->
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
      ha-entity-picker,
      ha-icon-picker,
      ha-textfield,
      select {
        width: 100%;
        display: block;
      }
      select {
        padding: 8px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
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