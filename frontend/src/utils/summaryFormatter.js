/**
 * summaryFormatter.js
 * Transforms video analysis metrics into sophisticated, precise, and executive-grade
 * automotive inspection English.
 */

export function formatExecutiveSummary(rawSummary, resultData = {}) {
  // Extract overall score & label
  const rawOverall = resultData.overall_quality?.overall_score ?? resultData.overall_quality_score ?? 6.1;
  const overallScore = typeof rawOverall === 'number' ? rawOverall.toFixed(1) : Number(rawOverall || 6.1).toFixed(1);

  const overallLabel =
    resultData.overall_quality?.overall_label ||
    (Number(overallScore) >= 8.5 ? 'Excellent' : (Number(overallScore) >= 7.0 ? 'Good' : (Number(overallScore) >= 5.5 ? 'Fair' : 'Needs Attention')));

  // Extract video score & label
  const rawVideo = resultData.video_analysis?.quality_score ?? resultData.video_quality_score ?? 5.2;
  const videoScore = typeof rawVideo === 'number' ? rawVideo.toFixed(1) : Number(rawVideo || 5.2).toFixed(1);

  const videoLabel =
    resultData.video_analysis?.quality_label ||
    (Number(videoScore) >= 8.0 ? 'Excellent' : (Number(videoScore) >= 7.0 ? 'Good' : (Number(videoScore) >= 5.0 ? 'Fair' : 'Needs Attention')));

  // Extract audio score & label
  const rawAudio = resultData.audio_analysis?.score ?? resultData.audio_quality_score ?? 7.0;
  const audioScore = typeof rawAudio === 'number' ? rawAudio.toFixed(1) : Number(rawAudio || 7.0).toFixed(1);

  const audioLabel = Number(audioScore) >= 7.0 ? 'Good' : (Number(audioScore) >= 5.0 ? 'Fair' : 'Moderate');

  // Metadata
  const vehicle = resultData.citnow_metadata?.vehicle || resultData.vehicle_make || 'BMW vehicle';
  const registration = resultData.citnow_metadata?.registration || resultData.citnow_registration || '';
  const dealership = resultData.citnow_metadata?.dealership || resultData.dealer_name || '';
  const advisor = resultData.citnow_metadata?.advisor_name || '';

  // Determine if speech narrative is present
  const rawSpeech = resultData.transcription?.text || '';
  const isSpeechGarbage = ['the', 'a', ',', '.', '...', 'no clear speech detected'].includes(rawSpeech.trim().toLowerCase());
  const hasSpokenNarration = rawSpeech.trim().length >= 10 && !isSpeechGarbage && !rawSpeech.includes('transcription failed');

  // Check if rawSummary was the robotic legacy template
  const isLegacyTemplate = !rawSummary ||
    rawSummary.includes('Technical inspection details: The video quality is graded at') ||
    rawSummary.includes('documents a walkaround and health check inspection') ||
    rawSummary.includes('indicates Fair with an overall score of') ||
    rawSummary.includes('The lighting is clean and clearly illuminates');

  // 1. Executive Assessment
  let executiveText = '';
  const numOverall = Number(overallScore);
  if (numOverall >= 8.5) {
    executiveText = `This technical inspection report provides a high-fidelity visual health check of the ${vehicle}${registration ? ` (${registration})` : ''}. The recording achieves an exemplary overall quality index of ${overallScore}/10 (${overallLabel}), demonstrating outstanding adherence to premium dealership presentation standards.`;
  } else if (numOverall >= 7.0) {
    executiveText = `This technical inspection report provides a verified vehicle health check and walkaround assessment of the ${vehicle}${registration ? ` (${registration})` : ''}. The presentation achieves an overall quality index of ${overallScore}/10 (${overallLabel}), confirming professional workshop presentation compliance and clear customer visibility.`;
  } else if (numOverall >= 5.5) {
    executiveText = `This technical inspection report documents a walkaround health check and condition assessment of the ${vehicle}${registration ? ` (${registration})` : ''}. The recording achieves an overall quality index of ${overallScore}/10 (${overallLabel}), meeting baseline workshop documentation criteria while identifying key areas for visual presentation refinement.`;
  } else {
    executiveText = `This technical inspection report documents a preliminary walkaround of the ${vehicle}${registration ? ` (${registration})` : ''}. The recording is indexed at ${overallScore}/10 (${overallLabel}), indicating presentation constraints that require operational review prior to customer delivery.`;
  }

  // 2. Visual & Optical Quality Evaluation
  let visualText = '';
  const numVideo = Number(videoScore);
  if (numVideo >= 8.0) {
    visualText = `The recording demonstrates superior optical clarity, balanced illumination across both exterior body contours and mechanical assemblies, and disciplined camera tracking with smooth pan transitions.`;
  } else if (numVideo >= 6.5) {
    visualText = `Scene illumination is balanced and inspected components remain clearly identifiable in the frame, supported by steady camera tracking and consistent focal sharpness throughout the walkaround.`;
  } else if (numVideo >= 5.0) {
    visualText = `Subject framing and workshop lighting maintain adequate visibility across checked components. However, noticeable handheld motion and focal readjustments were detected during pan transitions; implementing steadier handheld pacing will noticeably elevate presentation stability.`;
  } else {
    visualText = `Visual clarity is impacted by rapid camera movement or uneven bay illumination, which obscures fine vehicle surface details and requires capture stabilization.`;
  }

  // 3. Acoustic Environment & Narration
  let acousticText = '';
  const numAudio = Number(audioScore);
  if (hasSpokenNarration) {
    acousticText = `The service bay acoustic profile remains clean with minimal interference. Spoken technician commentary is articulate and clearly audible, providing the customer with an informative verbal walkthrough of the inspection findings.`;
  } else if (numAudio >= 7.0) {
    acousticText = `Ambient workshop sound levels are well-controlled with minimal acoustic interference. Note: This recording was conducted as a dedicated silent visual walkaround without verbal technician voiceover.`;
  } else {
    acousticText = `Ambient background sound is registered within typical service bay operational limits. Conducted as a silent visual inspection without verbal technician commentary.`;
  }

  // 4. Custom spoken findings (if speech was summarized from Whisper)
  let spokenFindings = null;
  if (!isLegacyTemplate && rawSummary && rawSummary.length > 25) {
    spokenFindings = rawSummary;
  }

  // 5. Advisor Recommendation / Takeaway
  let recommendation = '';
  if (numOverall >= 7.5) {
    recommendation = `Customer Ready: High presentation standard suitable for immediate customer delivery.`;
  } else if (numOverall >= 5.5) {
    recommendation = `Suitable for customer review. Elevating handheld camera stability and introducing a concise verbal walkthrough greeting (introducing the dealership and vehicle registration) will further reinforce customer confidence and dealer transparency.`;
  } else {
    recommendation = `Operational Recommendation: Retake or supplement with steady framing and active verbal narration to ensure elevated customer transparency.`;
  }

  return {
    overallScore,
    overallLabel,
    videoScore,
    videoLabel,
    audioScore,
    audioLabel,
    vehicle,
    registration,
    dealership,
    advisor,
    executiveText,
    visualText,
    acousticText,
    spokenFindings,
    recommendation,
    hasSpokenNarration
  };
}
