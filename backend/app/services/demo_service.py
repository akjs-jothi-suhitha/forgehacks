from typing import Dict, Any, List
from app.schemas.session import (
    LearningPlanSchema, ConceptSchema, ConceptRelationshipSchema,
    ChallengeSchema, ReasoningAnalysisSchema, UnderstandingProfileSchema
)

class DemoService:
    """
    Deterministic demo provider for hackathon presentation and fallback mode.
    Provides curated, rich, subject-agnostic learning models for topics like
    Machine Learning, Photosynthesis, Newton's Laws, SQL Joins, TCP, etc.
    """

    @staticmethod
    def get_learning_plan(topic: str, level: str) -> LearningPlanSchema:
        topic_lower = topic.lower().strip()

        if "machine learning" in topic_lower or "ml" in topic_lower or "overfitting" in topic_lower:
            return LearningPlanSchema(
                topic="Machine Learning",
                level=level,
                core_concept_summary="Machine Learning enables computers to learn patterns from data and generalize to unseen scenarios without explicit rules.",
                concepts=[
                    ConceptSchema(
                        name="Machine Learning",
                        category="main",
                        summary="The subfield of AI focused on algorithms that learn from data to make predictions or decisions.",
                        depth_intuition="Imagine teaching a child to recognize cats by showing 100 cat photos instead of giving a list of rigid rules.",
                        depth_mechanism="Algorithms optimize internal parameters (weights) to minimize a loss function measuring prediction error.",
                        depth_technical="Given training dataset D = {(x_i, y_i)}, find model parameter vector θ minimizing empirical risk R_emp(θ).",
                        depth_example="Spam detection filters evaluating email text tokens to assign a probability of spam vs inbox.",
                        why_it_matters="Enables automated decision making in complex, high-dimensional domains where manual rules fail.",
                        real_world_app="Autonomous driving, medical diagnosis, recommendation systems (Netflix, Spotify).",
                        cross_domain_app="Biological evolution: natural selection adapts species features based on environmental feedback.",
                        contrast_concept="Rule-Based Programming (hardcoded IF/ELSE logic)."
                    ),
                    ConceptSchema(
                        name="Supervised Learning",
                        category="prerequisite",
                        summary="Learning paradigm where models are trained on input-output pairs labeled with ground truth.",
                        depth_intuition="Learning with an answer key or teacher correcting your homework after every problem.",
                        depth_mechanism="Computes loss between predicted outputs and target labels, updating weights via backpropagation.",
                        depth_technical="Maps input domain X to output label domain Y using labeled dataset L = (x_i, y_i).",
                        depth_example="Predicting house prices (continuous output) or classifying chest X-rays (categorical output).",
                        why_it_matters="Formulates the foundation of most commercial predictive AI applications today.",
                        real_world_app="Credit scoring, object detection in security cameras, disease classification.",
                        cross_domain_app="Apprenticeship: learning a craft under master supervision with instant feedback.",
                        contrast_concept="Unsupervised Learning (finding hidden patterns in unlabeled data)."
                    ),
                    ConceptSchema(
                        name="Training/Test Split",
                        category="prerequisite",
                        summary="Partitioning data into separate subsets to evaluate model performance on unseen data.",
                        depth_intuition="Studying textbook practice problems, then taking an exam with brand new questions.",
                        depth_mechanism="Data is split (e.g., 80% train, 20% test) to prevent data leakage and evaluate real-world readiness.",
                        depth_technical="Ensures test error estimate R_test(θ) approximates true risk R_true(θ) independently of R_train(θ).",
                        depth_example="Holding out 2,000 patient records out of 10,000 to validate a heart disease detector.",
                        why_it_matters="Without a holdout set, high training performance creates a dangerous illusion of competence.",
                        real_world_app="Algorithm benchmarking, clinical trials for medical AI devices.",
                        cross_domain_app="Driving license exam: road test in real traffic after practicing in parking lots.",
                        contrast_concept="K-Fold Cross Validation (resampling technique)."
                    ),
                    ConceptSchema(
                        name="Generalization",
                        category="related",
                        summary="A model's ability to perform accurately on new, previously unseen data samples.",
                        depth_intuition="Understanding the core principle of physics rather than memorizing exact textbook answers.",
                        depth_mechanism="Measures how well the function learned on sample D generalizes to the true underlying distribution P(X, Y).",
                        depth_technical="Bounded by generalization error bounds: |R_emp(θ) - R_true(θ)| ≤ O(√(VC-dim/N)).",
                        depth_example="A speech recognition model correctly understanding a speaker with a regional accent it never heard in training.",
                        why_it_matters="Generalization is the ultimate goal of learning; memorization without generalization is useless.",
                        real_world_app="Fraud detection catching brand-new fraud techniques, self-driving cars handling new road conditions.",
                        cross_domain_app="Transferable skills: learning chess principles translates to strategic thinking in business.",
                        contrast_concept="Memorization / Rote Learning."
                    ),
                    ConceptSchema(
                        name="Overfitting",
                        category="related",
                        summary="When a model memorizes noise and specific details of training data, failing on new inputs.",
                        depth_intuition="A student memorizing line-for-line the textbook practice problems, but failing when numbers change slightly.",
                        depth_mechanism="High-capacity model captures statistical noise in training set as meaningful signals, causing train error → 0 while test error spikes.",
                        depth_technical="Occurs when model complexity exceeds data complexity, leading to high variance and unstable predictions.",
                        depth_example="A model reaching 99% accuracy on training data but dropping to 60% on unseen test data.",
                        why_it_matters="Overfitting is the #1 mistake in AI engineering, creating models that look great in demos but fail in production.",
                        real_world_app="Trading algorithms failing live markets despite perfect backtest results.",
                        cross_domain_app="Over-preparing for a job interview with scripted answers that sound unnatural when questions vary.",
                        contrast_concept="Underfitting (model too simple to capture real underlying trends)."
                    ),
                    ConceptSchema(
                        name="Bias-Variance Tradeoff",
                        category="related",
                        summary="The balance between systematic error (bias) and sensitivity to data fluctuations (variance).",
                        depth_intuition="Target practice: High bias misses the bullseye consistently; high variance hits all over the target.",
                        depth_mechanism="Total Expected Error = Bias² + Variance + Irreducible Noise. Decreasing bias usually increases variance.",
                        depth_technical="Bias = E[f_hat(x)] - f(x); Variance = E[(f_hat(x) - E[f_hat(x)])²]. Optimal model minimizes total error.",
                        depth_example="A linear regression line (high bias, low variance) vs a 15th-degree polynomial curve (low bias, high variance).",
                        why_it_matters="Guides model selection, hyperparameter tuning, and regularization strategies.",
                        real_world_app="Selecting model architecture depth for embedded devices vs cloud neural networks.",
                        cross_domain_app="Governance: Strict rigid laws (high bias) vs flexible case-by-case judgements (high variance).",
                        contrast_concept="Irreducible Error (inherent noise in measurement data)."
                    )
                ],
                prerequisites=["Supervised Learning", "Training/Test Split"],
                misconceptions=[
                    "High training accuracy guarantees high test accuracy.",
                    "More parameters and complex models are always superior to simple ones.",
                    "Overfitting means the training dataset was too small."
                ],
                real_world_applications=[
                    "Medical Diagnostic Imaging",
                    "Algorithmic Stock Trading",
                    "Autonomous Navigation",
                    "Personalized Recommendation Systems"
                ],
                relationships=[
                    ConceptRelationshipSchema(
                        source_concept="Supervised Learning",
                        target_concept="Machine Learning",
                        relation_type="PREREQUISITE",
                        explanation="Supervised learning provides the foundational labeled data setup for core ML."
                    ),
                    ConceptRelationshipSchema(
                        source_concept="Training/Test Split",
                        target_concept="Supervised Learning",
                        relation_type="PREREQUISITE",
                        explanation="Proper evaluation requires splitting data into distinct training and test sets."
                    ),
                    ConceptRelationshipSchema(
                        source_concept="Training/Test Split",
                        target_concept="Generalization",
                        relation_type="CAUSES",
                        explanation="Test set evaluation measures true generalization capability."
                    ),
                    ConceptRelationshipSchema(
                        source_concept="Generalization",
                        target_concept="Overfitting",
                        relation_type="CONTRASTS_WITH",
                        explanation="Overfitting is the exact breakdown of generalization capacity."
                    ),
                    ConceptRelationshipSchema(
                        source_concept="Overfitting",
                        target_concept="Bias-Variance Tradeoff",
                        relation_type="DEPENDS_ON",
                        explanation="Overfitting represents excessive variance in the bias-variance tradeoff."
                    )
                ]
            )

        elif "photosynthesis" in topic_lower:
            return LearningPlanSchema(
                topic="Photosynthesis",
                level=level,
                core_concept_summary="Photosynthesis is the biochemical process by which plants convert light energy into chemical energy stored in glucose.",
                concepts=[
                    ConceptSchema(
                        name="Photosynthesis",
                        category="main",
                        summary="Conversion of solar energy, carbon dioxide, and water into glucose and oxygen.",
                        depth_intuition="Solar panels powering a chemical factory that produces food out of thin air and water.",
                        depth_mechanism="Light photons excite chlorophyll electrons, driving electron transport chains that synthesize ATP and NADPH to fix CO2.",
                        depth_technical="6 CO2 + 6 H2O + photon energy → C6H12O6 + 6 O2 (ΔG°' = +2870 kJ/mol).",
                        depth_example="Oak leaves absorbing sunlight to grow timber while releasing oxygen into the atmosphere.",
                        why_it_matters="Sustains life on Earth by generating atmospheric oxygen and organic carbon inputs for food chains.",
                        real_world_app="Agricultural crop yield optimization, artificial photosynthesis solar fuels research.",
                        cross_domain_app="Solar Energy Storage: converting transient solar radiation into chemical battery energy.",
                        contrast_concept="Cellular Respiration (the inverse breakdown of glucose to release ATP)."
                    ),
                    ConceptSchema(
                        name="Light-Dependent Reactions",
                        category="prerequisite",
                        summary="Reactions in thylakoid membranes that capture sunlight to yield ATP, NADPH, and O2.",
                        depth_intuition="Solar-driven water pumps generating pressurized fuel canisters (ATP & NADPH) while venting oxygen.",
                        depth_mechanism="Photosystems II and I split H2O, transport electrons along thylakoids, creating a proton gradient.",
                        depth_technical="Photolysis of H2O: 2 H2O → O2 + 4 H+ + 4 e-, driving chemiosmotic ATP synthesis.",
                        depth_example="Chloroplast thylakoids glowing under blue light as electrons flow through Photosystem II.",
                        why_it_matters="Directly harvests light energy into usable cellular energy carriers.",
                        real_world_app="Designing bio-inspired photovoltaic cells.",
                        cross_domain_app="Hydroelectric Dams: potential energy gradient driving turbines (ATP synthase).",
                        contrast_concept="Calvin Cycle (Light-Independent Reactions)."
                    ),
                    ConceptSchema(
                        name="Calvin Cycle",
                        category="related",
                        summary="Stroma-based light-independent reactions that fix CO2 into 3-carbon sugars using ATP & NADPH.",
                        depth_intuition="The assembly line inside the factory using stored battery power to assemble sugar blocks.",
                        depth_mechanism="RuBisCO enzyme fixes atmospheric CO2 into 3-PGA, reduced to G3P by ATP and NADPH.",
                        depth_technical="Carbon fixation phase, reduction phase, and RuBP regeneration phase.",
                        depth_example="Plants absorbing CO2 through stomata during daylight to build biomass.",
                        why_it_matters="Converts inorganic carbon gas into organic bio-molecules.",
                        real_world_app="Genetic engineering of RuBisCO to increase carbon capture efficiency.",
                        cross_domain_app="Industrial Carbon Capture and Utilization (CCU).",
                        contrast_concept="Krebs Cycle (mitochondrial carbon oxidation)."
                    )
                ],
                prerequisites=["Light-Dependent Reactions"],
                misconceptions=[
                    "Photosynthesis only happens during daytime, but plants do not breathe at night.",
                    "Plants turn sunlight directly into sugar without intermediate energy carriers."
                ],
                real_world_applications=["Bio-energy generation", "Carbon Sequestration", "Crop Yield Optimization"],
                relationships=[
                    ConceptRelationshipSchema(
                        source_concept="Light-Dependent Reactions",
                        target_concept="Photosynthesis",
                        relation_type="PREREQUISITE",
                        explanation="Light reactions generate the essential energy carriers ATP and NADPH."
                    ),
                    ConceptRelationshipSchema(
                        source_concept="Light-Dependent Reactions",
                        target_concept="Calvin Cycle",
                        relation_type="CAUSES",
                        explanation="Outputs of light reactions directly power the Calvin Cycle carbon fixation."
                    )
                ]
            )

        # Dynamic Generic Fallback for any other custom user topic
        clean_topic = topic.strip().capitalize()
        return LearningPlanSchema(
            topic=clean_topic,
            level=level,
            core_concept_summary=f"Core conceptual breakdown and applications of {clean_topic}.",
            concepts=[
                ConceptSchema(
                    name=clean_topic,
                    category="main",
                    summary=f"The primary principles, mechanisms, and application domains of {clean_topic}.",
                    depth_intuition=f"At an intuitive level, {clean_topic} provides a structured model to understand fundamental relationships.",
                    depth_mechanism=f"The underlying mechanism of {clean_topic} operates through clear inputs, transformations, and outputs.",
                    depth_technical=f"Technically, {clean_topic} formalizes rules and constraints to optimize outcome predictability.",
                    depth_example=f"A practical real-world scenario illustrating {clean_topic} in action.",
                    why_it_matters=f"Understanding {clean_topic} unlocks deeper problem solving across related domains.",
                    real_world_app=f"Modern industry applications utilizing {clean_topic} principles.",
                    cross_domain_app=f"How {clean_topic} connects with concepts in adjacent fields.",
                    contrast_concept="Superficial memorization of facts without underlying intuition."
                ),
                ConceptSchema(
                    name=f"Fundamentals of {clean_topic}",
                    category="prerequisite",
                    summary=f"Prerequisite concepts and core building blocks necessary for {clean_topic}.",
                    depth_intuition="Building a solid foundation before tackling advanced scenarios.",
                    depth_mechanism="Establishing baseline definitions, parameters, and relationships.",
                    depth_technical="Formal mathematical or structural constraints.",
                    depth_example=f"Initial baseline case study of {clean_topic}.",
                    why_it_matters="Without prerequisites, complex applications become prone to systematic errors.",
                    real_world_app="Standard operating procedures in domain engineering.",
                    cross_domain_app="Foundational logic in systems design.",
                    contrast_concept="Advanced specialized edge cases."
                ),
                ConceptSchema(
                    name=f"Applied {clean_topic}",
                    category="related",
                    summary=f"Applying {clean_topic} to solve complex real-world challenges.",
                    depth_intuition="Taking theory out of the textbook into practical execution.",
                    depth_mechanism="Adapting baseline mechanisms to non-ideal, noisy real-world conditions.",
                    depth_technical="Optimizing performance metrics under operational constraints.",
                    depth_example="Case study under high-stress conditions.",
                    why_it_matters="Bridge between theoretical knowledge and practical mastery.",
                    real_world_app="Field implementation and deployment.",
                    cross_domain_app="Interdisciplinary problem solving.",
                    contrast_concept="Pure theoretical abstraction."
                )
            ],
            prerequisites=[f"Fundamentals of {clean_topic}"],
            misconceptions=[
                f"Confusing memorized formulas with true understanding of {clean_topic}.",
                "Assuming initial baseline assumptions hold true under all conditions."
            ],
            real_world_applications=[f"System Optimization", f"Domain Analysis for {clean_topic}"],
            relationships=[
                ConceptRelationshipSchema(
                    source_concept=f"Fundamentals of {clean_topic}",
                    target_concept=clean_topic,
                    relation_type="PREREQUISITE",
                    explanation=f"Foundational understanding is necessary prior to applying {clean_topic}."
                ),
                ConceptRelationshipSchema(
                    source_concept=clean_topic,
                    target_concept=f"Applied {clean_topic}",
                    relation_type="APPLIED_IN",
                    explanation=f"Theoretical {clean_topic} powers practical engineering solutions."
                )
            ]
        )

    @staticmethod
    def get_challenge(topic: str, concept_name: str) -> ChallengeSchema:
        topic_lower = topic.lower().strip()

        if "machine learning" in topic_lower or "overfitting" in topic_lower or "ml" in topic_lower:
            return ChallengeSchema(
                id="demo-challenge-ml-1",
                concept_name="Overfitting vs Generalization",
                scenario="A machine learning engineer trains a deep neural network on customer behavior data. The model achieves 98.5% accuracy on the training set, but when deployed to production on real unseen customers, accuracy drops drastically to 64.2%.",
                task="Analyze what is happening with this model. Explain WHY the performance dropped on unseen data and propose TWO concrete engineering solutions to solve the problem.",
                challenge_type="scenario",
                difficulty="intermediate",
                context="Dataset size: 10,000 samples. Model parameters: 5,000,000. No regularization or dropout applied.",
                hints=[
                    "Hint 1: Think about the difference between memorizing training samples and learning true underlying patterns.",
                    "Hint 2: Look at the ratio of model parameters (5 Million) relative to dataset size (10,000). What does this imply about model capacity?",
                    "Hint 3: Consider techniques that constrain model capacity or artificially expand the dataset (e.g. Regularization L1/L2, Dropout, Data Augmentation, or Early Stopping)."
                ]
            )

        elif "photosynthesis" in topic_lower:
            return ChallengeSchema(
                id="demo-challenge-bio-1",
                concept_name="Light-Dependent vs Calvin Cycle",
                scenario="A greenhouse technician leaves plants under constant green light while maintaining CO2 and water supply. Within 48 hours, the plant stops growing and sugar production halts.",
                task="Explain why green light halts sugar production despite supplying carbon dioxide and water.",
                challenge_type="scenario",
                difficulty="intermediate",
                context="Chlorophyll pigments primarily absorb blue (~430nm) and red (~660nm) wavelengths.",
                hints=[
                    "Hint 1: Which plant pigment absorbs light energy, and what wavelengths does it reflect?",
                    "Hint 2: What happens to the Light-Dependent Reactions if light energy cannot be absorbed?",
                    "Hint 3: If Light-Dependent Reactions stop producing ATP and NADPH, how does this impact the Calvin Cycle?"
                ]
            )

        return ChallengeSchema(
            id=f"demo-challenge-generic-1",
            concept_name=concept_name,
            scenario=f"An applied engineering team encounters a unexpected system bottleneck when deploying a solution based on {topic}.",
            task=f"Analyze why the system failed under new conditions. Identify missing conceptual factors and explain your reasoning for a proposed solution.",
            challenge_type="scenario",
            difficulty="intermediate",
            context=f"Targeting conceptual application of {concept_name}.",
            hints=[
                "Hint 1: Review the core intuition of the concept.",
                "Hint 2: Identify edge cases where baseline assumptions fail.",
                "Hint 3: Connect the concept to underlying structural constraints."
            ]
        )

    @staticmethod
    def evaluate_reasoning(topic: str, challenge_task: str, user_input: str) -> ReasoningAnalysisSchema:
        input_lower = user_input.lower().strip()

        # Detailed evaluation logic for Machine Learning scenario
        if "overfit" in input_lower or "memoriz" in input_lower or "unseen" in input_lower or "generaliz" in input_lower:
            has_solutions = any(word in input_lower for word in ["regulariz", "dropout", "data", "early stop", "more data", "simplify", "cross-validat", "prun", "l1", "l2"])
            has_reasoning = "because" in input_lower or "due to" in input_lower or "since" in input_lower or "noise" in input_lower or "capacity" in input_lower or "high variance" in input_lower

            if has_solutions and has_reasoning:
                return ReasoningAnalysisSchema(
                    understanding_level="complete",
                    score=92.0,
                    profile=UnderstandingProfileSchema(
                        overall_score=92.0,
                        knowledge=95.0,
                        connections=90.0,
                        reasoning=92.0,
                        application=94.0,
                        explanation=89.0
                    ),
                    concepts_understood=[
                        "Overfitting definition",
                        "Training vs Test performance discrepancy",
                        "Model generalization failure",
                        "Capacity constraint solutions (Regularization/Dropout)"
                    ],
                    missing_concepts=[],
                    misconceptions=[],
                    reasoning_quality="exemplary",
                    feedback="Outstanding conceptual reasoning! You correctly identified that the model overfitted by memorizing noise in the training set rather than learning generalizable features. Furthermore, your proposed solutions (regularization / data expansion) directly target the high variance root cause.",
                    next_learning_action="escalation",
                    adaptive_challenge=ChallengeSchema(
                        id="demo-challenge-ml-2",
                        concept_name="Bias-Variance Tradeoff in Deep Models",
                        scenario="Now suppose you applied strong L2 regularization and Dropout, reducing training accuracy to 70% and test accuracy to 69%. Both accuracies are now low.",
                        task="What problem has occurred now? Explain how the bias-variance tradeoff shifted, and what you should adjust next.",
                        challenge_type="scenario",
                        difficulty="advanced",
                        hints=["Hint 1: Compare underfitting vs overfitting.", "Hint 2: Did we increase bias too much?"]
                    )
                )
            else:
                return ReasoningAnalysisSchema(
                    understanding_level="partial",
                    score=74.0,
                    profile=UnderstandingProfileSchema(
                        overall_score=74.0,
                        knowledge=82.0,
                        connections=68.0,
                        reasoning=72.0,
                        application=75.0,
                        explanation=73.0
                    ),
                    concepts_understood=[
                        "Overfitting phenomenon",
                        "Discrepancy between training and unseen test accuracy"
                    ],
                    missing_concepts=[
                        "Generalization error bounds",
                        "Concrete model capacity control (Dropout / L1/L2 Regularization)"
                    ],
                    misconceptions=[],
                    reasoning_quality="developing",
                    feedback="Great intuition! You correctly recognized that the model is suffering from overfitting on the training set. However, your explanation can be strengthened by explicitly connecting model capacity (5 Million parameters vs 10,000 samples) to high variance and suggesting concrete remediation methods like Dropout or Regularization.",
                    next_learning_action="targeted_explanation",
                    adaptive_challenge=ChallengeSchema(
                        id="demo-challenge-ml-adapt-1",
                        concept_name="Model Capacity & Regularization",
                        scenario="To fix overfitting without throwing away data, engineers often use Regularization (L2 penalty) or Dropout.",
                        task="Explain in 2 sentences how Dropout forces a neural network to learn redundant, generalizable features instead of relying on specific memorized paths.",
                        challenge_type="comparison",
                        difficulty="intermediate",
                        hints=["Hint 1: Think about what happens when random neurons are zeroed out during training."]
                    )
                )
        elif len(user_input.strip()) < 15:
            return ReasoningAnalysisSchema(
                understanding_level="superficial",
                score=45.0,
                profile=UnderstandingProfileSchema(
                    overall_score=45.0,
                    knowledge=50.0,
                    connections=40.0,
                    reasoning=38.0,
                    application=45.0,
                    explanation=40.0
                ),
                concepts_understood=["Basic topic recognition"],
                missing_concepts=["Mechanistic reasoning", "Cause-and-effect relationship", "Engineering solutions"],
                misconceptions=["Superficial answer without logical explanation"],
                reasoning_quality="initial",
                feedback="Your response touches on the topic but is very brief. In ConceptForge AI, we focus on understanding *why* a system behaves a certain way. Try elaborating on the underlying mechanism.",
                next_learning_action="prerequisite_review"
            )
        else:
            # Solid default analysis for arbitrary responses
            return ReasoningAnalysisSchema(
                understanding_level="partial",
                score=78.0,
                profile=UnderstandingProfileSchema(
                    overall_score=78.0,
                    knowledge=80.0,
                    connections=75.0,
                    reasoning=76.0,
                    application=80.0,
                    explanation=79.0
                ),
                concepts_understood=["Core scenario identification", "Problem statement recognition"],
                missing_concepts=["Formal theoretical connection", "Edge-case analysis"],
                misconceptions=[],
                reasoning_quality="proficient",
                feedback="Good effort! You demonstrated strong baseline intuition and addressed the main task. To elevate your understanding to mastery, consider how this concept behaves under boundary conditions.",
                next_learning_action="targeted_explanation"
            )
