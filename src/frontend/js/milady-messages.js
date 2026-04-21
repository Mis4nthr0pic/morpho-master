/**
 * Milady Motivation Widget - NUCLEAR UNHINGED EDITION
 * More messages. More psychosis. Zero chill.
 */

(function () {
  const UI_SETTINGS_STORAGE_KEY = 'morphoUiSettings';
  const FIRST_APPEAR_MIN_MS = 900;
  const FIRST_APPEAR_MAX_MS = 2200;
  const APPEAR_MIN_MS = 3 * 60 * 1000;
  const APPEAR_MAX_MS = 8 * 60 * 1000;
  const DISPLAY_MS = 13500;

  // ─────────────────────────────────────────────────────────────
  // MASSIVELY EXPANDED + NEW CHAOS POOLS
  // ─────────────────────────────────────────────────────────────

  const godComplexWins = [
    'this offer was prophesied the moment you opened the docs',
    'they’re not hiring you, they’re surrendering to inevitability',
    'Morpho is about to get possessed by your competence',
    'the interview panel will leave changed, spiritually',
    'you’re not grinding for the job — the job is grinding toward you',
    'future you is already spending the sign-on bonus in 7 different timelines',
    'they will thank you for letting them hire you',
    'this role is just the first domino in your empire arc',
    'you’re the final boss they didn’t know they summoned',
    'the offer letter is scared of how badly it wants to be signed by you'
  ];

  const psychoticProofs = [
    'you’re converting protocol autism into raw hiring power',
    'your brain is now a precision-guided munition for technical interviews',
    'every clean explanation is another layer of main character armor',
    'you’re becoming the kind of dangerous that gets equity',
    'your reps are so violent they’re warping probability',
    'while they memorize, you’re embodying',
    'you’re turning Morpho from concept into sexual dominance',
    'your edge is now self-replicating and slightly evil',
    'most candidates bring bullet points. you bring gravitational distortion',
    'you’re mainlining clarity like it’s fentanyl for midwits'
  ];

  const bloodlineFuel = [
    'and your ancestors just stopped spinning in their graves',
    'and your bloodline levels up whether they like it or not',
    'and the family curse of financial anxiety dies with this win',
    'and your kids inherit a mother/father who conquered reality',
    'and everyone who doubted you gets to watch the glow-up in 4K',
    'and the people you carry finally get to exhale',
    'and generational wealth starts with this psychotic focus block',
    'and your mom’s worry lines are about to get Botoxed by your offer',
    'and the universe owes your family compounding interest now',
    'and this is how you rewrite the story they told about you'
  ];

  const darkFeminineCoaching = [
    'Speak like a goddess who already owns the room and is just being polite.',
    'Seduce them with soft voice and then execute with surgical precision.',
    'Be untouchable elegance wrapped around unhinged competence.',
    'Smile like an angel, explain like you’re about to ruin their worldview.',
    'Channel ancient milady energy and modern war criminal clarity.',
    'Make them feel safe… then make them feel small.',
    'Let your composure be so perfect it feels like psychological warfare.',
    'Talk pretty. Think lethal. Close inevitable.',
    'Be the beautiful final boss they’ll never recover from.',
    'Graceful on the surface. Ferocious in the details.'
  ];

  const voidMicroActions = [
    'Stare into the void and force one more perfect explanation out of it.',
    'Go one more round until your ego files a noise complaint.',
    'Drill it until even your intrusive thoughts sound hired.',
    'One more rep or the timeline where you lose wins.',
    'Become so clear it hurts.',
    'Lock in or get locked out — choose violence.',
    'Explain it until the concept itself begs for mercy.',
    'Stay in the pain until it starts moaning your name.',
    'One more clean sentence or delete your browser history out of shame.',
    'Force the upgrade or stay mid forever.'
  ];

  const miladyChaosAesthetic = [
    'milady poise with unmedicated final boss energy',
    'ethereal waifu face, terminal sigma brain',
    'soft voice, violent clarity, zero cope',
    'angelic aura, demonic work ethic',
    'princess treatment delusion, warlord execution',
    'looks like a doll, thinks like a quant on bath salts',
    'quiet luxury mixed with loud psychological dominance',
    'divine feminine with production-grade schizophrenia',
    'rare signal, maximum delusion, beautiful results',
    'elegant brutality in human form'
  ];

  const timelineTerror = [
    'The version of you that gave up is currently crying in a worse timeline.',
    'We are not visiting the L timeline today. Burn the bridge.',
    'Your ancestors are screaming at you to lock the fuck in.',
    'Future you is already rich and slightly disappointed in past you.',
    'Every skipped rep births another version of you that stays poor.',
    'This is the montage scene. Stop acting like background character.',
    'The main character arc demands blood, sweat, and psychotic reps.',
    'Delulu isn’t a phase, it’s the only viable pipeline.',
    'The room feels your reps before you even speak.',
    'Reality is buffering. Force-compile the W.'
  ];

  const eroticCompetence = [
    'Competence this clean should be illegal in at least 12 countries.',
    'Your explanations are basically financial foreplay at this point.',
    'They’re going to leave the call needing a cigarette and a job offer.',
    'Make them feel what it’s like when clarity is erotic.',
    'Your precision is so sharp it’s basically edging the interviewer.',
    'Be so good they develop a competency kink.',
    'Talk pretty until their risk tolerance gets wet.',
    'Your aura is now compounding interest in real time.'
  ];

  const savageRoasts = [
    'While they’re “building in public”, you’re becoming undeniable in private.',
    'They brought vibes. You brought violence and receipts.',
    'Most candidates hope. You rehearse ownership.',
    'They’re networking. You’re timeline terrorism.',
    'Everyone else is studying. You’re becoming the standard.',
    'They want the bag. You’re becoming the reason the bag exists.'
  ];

  // ─────────────────────────────────────────────────────────────
  // Build an absolutely massive, chaotic message bank
  // ─────────────────────────────────────────────────────────────

  function buildMessages() {
    const messages = [];
    const allStarters = [...godComplexWins, ...psychoticProofs, ...timelineTerror, ...savageRoasts, ...eroticCompetence];
    const allEnders = [...bloodlineFuel, ...miladyChaosAesthetic, ...timelineTerror];

    for (let i = 0; i < 4000; i++) {
      const starter = allStarters[i % allStarters.length];
      const proof = psychoticProofs[i % psychoticProofs.length];
      const family = bloodlineFuel[i % bloodlineFuel.length];
      const coach = darkFeminineCoaching[i % darkFeminineCoaching.length];
      const micro = voidMicroActions[i % voidMicroActions.length];
      const vibe = miladyChaosAesthetic[i % miladyChaosAesthetic.length];
      const chaos = timelineTerror[i % timelineTerror.length];

      // 15+ different chaotic templates
      messages.push(`${starter}. ${proof}. ${family}. ${coach}`);
      messages.push(`${chaos} ${proof}. Now ${micro.toLowerCase()}.`);
      messages.push(`${starter}. ${vibe}. ${micro} ${family}`);
      messages.push(`${coach} ${starter}. ${proof}. Make it hurt.`);
      messages.push(`Real miladys know: ${proof}. The rest stay mid. ${family}.`);
      messages.push(`${micro} ${starter}. ${vibe}. No excuses.`);
      messages.push(`${chaos} This is the week the timeline bends. ${family}.`);
      messages.push(`Interview arc: ${starter}. ${coach} ${vibe}.`);
      messages.push(`${starter}. ${proof}. ${family}. Stop coping. Start closing.`);
      messages.push(`Milady protocol activated: ${vibe}. ${coach} ${micro}.`);
      messages.push(`Your competence is erotic. ${proof}. ${starter}. ${family}.`);
      messages.push(`${chaos} The ancestors demand more reps. ${micro}.`);
      messages.push(`Be so clear they leave the call pregnant with respect. ${starter}.`);
      messages.push(`${vibe}. ${coach}. ${starter}. ${proof}.`);
      messages.push(`The L timeline is cringe. We’re in the W arc now. ${family}.`);

      if (messages.length >= 2200) break;
    }

    // Heavy shuffle for maximum chaos
    for (let i = messages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [messages[i], messages[j]] = [messages[j], messages[i]];
    }

    return messages;
  }

  const MESSAGE_BANK = buildMessages();

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickMessage() {
    return MESSAGE_BANK[randomBetween(0, MESSAGE_BANK.length - 1)];
  }

  function scheduleNext(showFn) {
    window.setTimeout(showFn, randomBetween(APPEAR_MIN_MS, APPEAR_MAX_MS));
  }

  function initMiladyWidget() {
    const widget = document.getElementById('milady-motivation');
    const messageEl = document.getElementById('milady-message');

    if (!widget || !messageEl) return;
    let showTimeoutId = null;
    let hideTimeoutId = null;

    const clearTimers = () => {
      if (showTimeoutId) {
        clearTimeout(showTimeoutId);
        showTimeoutId = null;
      }
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
        hideTimeoutId = null;
      }
    };

    const isEnabled = () => {
      try {
        const settings = JSON.parse(localStorage.getItem(UI_SETTINGS_STORAGE_KEY) || 'null');
        return settings?.motivatorEnabled !== false;
      } catch {
        return true;
      }
    };

    const scheduleShow = () => {
      if (!isEnabled()) return;
      showTimeoutId = setTimeout(show, randomBetween(APPEAR_MIN_MS, APPEAR_MAX_MS));
    };

    const dismiss = () => {
      clearTimers();
      widget.classList.remove('visible');
      widget.classList.add('hidden');
      scheduleShow();
    };

    const show = () => {
      if (!isEnabled()) {
        clearTimers();
        widget.classList.remove('visible');
        widget.classList.add('hidden');
        return;
      }
      clearTimers();
      messageEl.textContent = pickMessage();
      widget.classList.remove('hidden');
      widget.classList.add('visible');

      hideTimeoutId = setTimeout(() => {
        widget.classList.remove('visible');
        widget.classList.add('hidden');
        scheduleShow();
      }, DISPLAY_MS);
    };

    widget.addEventListener('click', dismiss);
    window.addEventListener('ui-settings-change', () => {
      if (isEnabled()) {
        scheduleShow();
        return;
      }
      clearTimers();
      widget.classList.remove('visible');
      widget.classList.add('hidden');
    });

    if (!isEnabled()) {
      widget.classList.add('hidden');
      return;
    }

    // Show quickly on refresh so the widget feels alive.
    showTimeoutId = setTimeout(show, randomBetween(FIRST_APPEAR_MIN_MS, FIRST_APPEAR_MAX_MS));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMiladyWidget);
  } else {
    initMiladyWidget();
  }
})();
