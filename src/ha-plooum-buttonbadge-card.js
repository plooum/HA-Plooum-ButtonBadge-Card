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
      entity: "light.mon_entite",
      name: "Mon Bouton",
      icon: "mdi:lightbulb",
      active_color: "#fff176",
      inactive_color: "#ffffff",
      tap_action: { action: "toggle" }
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Configuration invalide");
    }
    this.config = { ...config };
  }

  // --- Gestionnaire d'actions ---
  _handleAction(actionConfig, entityId) {
    if (!actionConfig) return;

    const action = actionConfig.action;
    
    if (action === "toggle" && entityId) {
      const domain = entityId.split(".")[0];
      this.hass.callService(domain, "toggle", { entity_id: entityId });
    } 
    else if (action === "navigate" && actionConfig.navigation_path) {
      window.history.pushState(null, "", actionConfig.navigation_path);
      window.dispatchEvent(new CustomEvent("location-changed"));
    } 
    else if (action === "execute_script" && actionConfig.script) {
      const scriptId = actionConfig.script.replace("script.", "");
      this.hass.callService("script", scriptId);
    }
  }

  // --- Événements Clic / Clic Long ---
  _startTimer(e, actionType) {
    this.longPress = false;
    this.timer = setTimeout(() => {
      this.longPress = true;
      const actionConfig = actionType === 'badge' ? this.config.badge_hold_action : this.config.hold_action;
      const entity = actionType === 'badge' ? this.config.badge_entity : this.config.entity;
      this._handleAction(actionConfig, entity);
    }, 500); // 500ms pour déclencher un clic long
  }

  _stopTimer(e, actionType) {
    clearTimeout(this.timer);
    if (!this.longPress) {
      const actionConfig = actionType === 'badge' ? this.config.badge_tap_action : this.config.tap_action;
      const entity = actionType === 'badge' ? this.config.badge_entity : this.config.entity;
      this._handleAction(actionConfig, entity);
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

    const showIcon = this.config.icon && this.config.icon !== "";
    const showName = this.config.name && this.config.name !== "";
    
    // Détermination de l'alignement
    const justifyContent = (showIcon && showName) ? "flex-start" : "center";

    // -- Calculs Badge --
    const hasBadge = this.config.badge_entity || this.config.badge_icon;
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
   ÉDITEUR VISUEL : ha-plooum-buttonbadge-card-editor
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
    const path = target.dataset.path.split(".");
    
    let newValue = target.value;
    // Gérer les cas où le champ est vidé
    if (newValue === "" && target.tagName !== "SELECT") newValue = undefined;

    const newConfig = { ...this._config };
    
    if (path.length === 1) {
      newConfig[path[0]] = newValue;
    } else if (path.length === 2) {
      newConfig[path[0]] = { ...newConfig[path[0]], [path[1]]: newValue };
    }

    // Déclencher l'événement pour Home Assistant
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _renderActionSettings(actionKey, title) {
    const actionObj = this._config[actionKey] || { action: "none" };
    return html`
      <div class="section">
        <h4>${title}</h4>
        <select .value="${actionObj.action}" data-path="${actionKey}.action" @change="${this._valueChanged}">
          <option value="none">Aucune action</option>
          <option value="toggle">Toggle (Inverser)</option>
          <option value="navigate">Naviguer</option>
          <option value="execute_script">Exécuter un script</option>
        </select>
        
        ${actionObj.action === "navigate" ? html`
          <input type="text" placeholder="Chemin (ex: /lovelace/home)" .value="${actionObj.navigation_path || ''}" data-path="${actionKey}.navigation_path" @input="${this._valueChanged}">
        ` : ""}
        
        ${actionObj.action === "execute_script" ? html`
          <input type="text" placeholder="ID Script (ex: script.mon_script)" .value="${actionObj.script || ''}" data-path="${actionKey}.script" @input="${this._valueChanged}">
        ` : ""}
      </div>
    `;
  }

  render() {
    if (!this.hass || !this._config) return html``;

    return html`
      <div class="editor-container">
        <h3>Bouton Principal</h3>
        
        <div class="grid">
          <input type="text" placeholder="Entité (ex: switch.lampe)" .value="${this._config.entity || ''}" data-path="entity" @input="${this._valueChanged}">
          <input type="text" placeholder="Texte affiché" .value="${this._config.name || ''}" data-path="name" @input="${this._valueChanged}">
          <input type="text" placeholder="Icône (ex: mdi:lamp)" .value="${this._config.icon || ''}" data-path="icon" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur actif (ex: #fff176)" .value="${this._config.active_color || ''}" data-path="active_color" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur inactif (ex: #ffffff)" .value="${this._config.inactive_color || ''}" data-path="inactive_color" @input="${this._valueChanged}">
        </div>

        ${this._renderActionSettings('tap_action', 'Action Clic (Bouton)')}
        ${this._renderActionSettings('hold_action', 'Action Clic Long (Bouton)')}

        <hr>

        <h3>Badge (Optionnel)</h3>
        <div class="grid">
          <input type="text" placeholder="Entité du badge" .value="${this._config.badge_entity || ''}" data-path="badge_entity" @input="${this._valueChanged}">
          <input type="text" placeholder="Icône du badge" .value="${this._config.badge_icon || ''}" data-path="badge_icon" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur fond actif" .value="${this._config.badge_active_color || ''}" data-path="badge_active_color" @input="${this._valueChanged}">
          <input type="text" placeholder="Couleur fond inactif" .value="${this._config.badge_inactive_color || ''}" data-path="badge_inactive_color" @input="${this._valueChanged}">
        </div>

        ${this._renderActionSettings('badge_tap_action', 'Action Clic (Badge)')}
        ${this._renderActionSettings('badge_hold_action', 'Action Clic Long (Badge)')}
      </div>
    `;
  }

  static get styles() {
    return css`
      .editor-container { padding: 16px 0; }
      h3 { margin-top: 0; margin-bottom: 8px; font-size: 1.2em; color: var(--primary-text-color); }
      h4 { margin: 8px 0 4px 0; font-size: 1em; color: var(--secondary-text-color); }
      .grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 16px; }
      .section { border-left: 3px solid var(--primary-color); padding-left: 8px; margin-bottom: 12px; }
      input, select {
        width: 100%; padding: 8px; margin-bottom: 4px; box-sizing: border-box;
        border: 1px solid var(--divider-color); border-radius: 4px;
        background: var(--card-background-color); color: var(--primary-text-color);
      }
      hr { border: none; border-top: 1px solid var(--divider-color); margin: 24px 0; }
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
    preview: true, // "true" permet à Home Assistant d'afficher une preview dans la liste
  });
}