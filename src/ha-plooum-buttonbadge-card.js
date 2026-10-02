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
   ÉDITEUR AVEC FORMULAIRE ET SÉLECTEURS NATIONAUX <ha-form>
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
    
    // Le composant <ha-form> renvoie directement l'objet config complet mis à jour
    const newConfig = ev.detail.value;

    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) return html``;

    const actionOptions = [
      { value: "toggle", label: "Toggle (Inverser entité)" },
      { value: "navigate", label: "Naviguer" },
      { value: "execute_script", label: "Exécuter un script" },
      { value: "none", label: "Aucune action" },
    ];

    // Définition du schéma interactif
    const schema = [
      // --- BOUTON PRINCIPAL ---
      { name: "entity", label: "Entité principale", selector: { entity: {} } },
      { name: "name", label: "Texte affiché", selector: { text: {} } },
      { name: "icon", label: "Icône principale", selector: { icon: {} } },
      { name: "active_color", label: "Couleur actif (ex: #fff176)", selector: { text: {} } },
      { name: "inactive_color", label: "Couleur inactif (ex: #ffffff)", selector: { text: {} } },

      // --- ACTIONS BOUTON ---
      { name: "tap_action_type", label: "Action au clic (Bouton)", selector: { select: { options: actionOptions } } },
      ...(this._config.tap_action_type === "navigate"
        ? [{ name: "tap_action_path", label: "Chemin de navigation (ex: /lovelace/entree)", selector: { text: {} } }]
        : []),
      ...(this._config.tap_action_type === "execute_script"
        ? [{ name: "tap_action_script", label: "Script à exécuter", selector: { entity: { domain: "script" } } }]
        : []),

      { name: "hold_action_type", label: "Action clic long (Bouton)", selector: { select: { options: actionOptions } } },
      ...(this._config.hold_action_type === "navigate"
        ? [{ name: "hold_action_path", label: "Chemin de navigation (Clic long)", selector: { text: {} } }]
        : []),
      ...(this._config.hold_action_type === "execute_script"
        ? [{ name: "hold_action_script", label: "Script à exécuter (Clic long)", selector: { entity: { domain: "script" } } }]
        : []),

      // --- BADGE ---
      { name: "badge_entity", label: "Entité du badge", selector: { entity: {} } },
      { name: "badge_icon", label: "Icône du badge", selector: { icon: {} } },
      { name: "badge_active_color", label: "Couleur fond badge actif", selector: { text: {} } },
      { name: "badge_inactive_color", label: "Couleur fond badge inactif", selector: { text: {} } },

      // --- ACTIONS BADGE ---
      { name: "badge_tap_action_type", label: "Action au clic (Badge)", selector: { select: { options: actionOptions } } },
      ...(this._config.badge_tap_action_type === "navigate"
        ? [{ name: "badge_tap_action_path", label: "Chemin de navigation (Badge)", selector: { text: {} } }]
        : []),
      ...(this._config.badge_tap_action_type === "execute_script"
        ? [{ name: "badge_tap_action_script", label: "Script à exécuter (Badge)", selector: { entity: { domain: "script" } } }]
        : []),

      { name: "badge_hold_action_type", label: "Action clic long (Badge)", selector: { select: { options: actionOptions } } },
      ...(this._config.badge_hold_action_type === "navigate"
        ? [{ name: "badge_hold_action_path", label: "Chemin de navigation (Badge clic long)", selector: { text: {} } }]
        : []),
      ...(this._config.badge_hold_action_type === "execute_script"
        ? [{ name: "badge_hold_action_script", label: "Script à exécuter (Badge clic long)", selector: { entity: { domain: "script" } } }]
        : []),
    ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${(s) => s.label ?? s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
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