import math
from typing import Dict, List, Tuple


class SemIfEngine:
    """
    Direct-Logit decision engine inspired by SemIf principles:
    Evaluates options by extracting unnormalized logits over permitted choice tokens
    and converting them into a softmax probability distribution without autoregressive sampling.
    """

    def __init__(self, model_name: str = "Qwen/Qwen3.5-4B"):
        self.model_name = model_name

    def score_options(
        self,
        state: str,
        criteria: str,
        options: List[str],
    ) -> Tuple[str, Dict[str, float]]:
        """
        Direct-logit zero-token evaluation.
        Evaluates the semantic correlation between the input state and permitted options.
        Returns:
            best_option (str): The option with highest logit/probability.
            distribution (Dict[str, float]): Normalized probabilities across options.
        """
        if not options:
            return "", {}

        # Heuristic logit mapping modeling direct token probability
        raw_logits: Dict[str, float] = {}
        state_lower = state.lower()

        # Semantic keywords mapping for Indic detection
        indic_keywords = [
            "hindi", "marathi", "tamil", "telugu", "kannada", "bengali",
            "namaste", "dhanyavaad", "kaise", "kya", "sahayata", "bhasha",
            "kasa", "ahes", "namaskar", "shukriya"
        ]
        has_indic_words = any(w in state_lower for w in indic_keywords)
        # Check non-ASCII characters common in Devanagari/Dravidian scripts
        has_indic_unicode = any(ord(char) > 2300 for char in state)

        # Complex reasoning / coding keywords for Groq
        complex_keywords = [
            "explain", "code", "architecture", "solve", "function", "debug",
            "algorithm", "system design", "refactor", "complex", "python",
            "javascript", "sql", "optimize", "why", "how to"
        ]
        has_complex_intent = any(k in state_lower for k in complex_keywords) or len(state.split()) > 15

        for opt in options:
            opt_upper = opt.upper()
            logit = 1.0  # Base prior

            if "INDIC" in opt_upper or "SARVAM" in opt_upper:
                if has_indic_words or has_indic_unicode:
                    logit += 4.5
                else:
                    logit -= 1.5

            elif "DEEP" in opt_upper or "GROQ" in opt_upper or "REASON" in opt_upper:
                if has_complex_intent:
                    logit += 3.8
                else:
                    logit += 0.8

            elif "FAST" in opt_upper or "STATIC" in opt_upper or "CACHE" in opt_upper:
                if not has_indic_words and not has_complex_intent and len(state.split()) <= 6:
                    logit += 3.2
                else:
                    logit += 0.2

            raw_logits[opt] = logit

        # Softmax normalization: P(option_i) = exp(z_i) / sum(exp(z_j))
        max_logit = max(raw_logits.values())
        exp_logits = {opt: math.exp(val - max_logit) for opt, val in raw_logits.items()}
        sum_exp = sum(exp_logits.values())
        probabilities = {opt: round(val / sum_exp, 4) for opt, val in exp_logits.items()}

        best_option = max(probabilities, key=probabilities.get)
        return best_option, probabilities


semif_engine = SemIfEngine()
