"use client";
import "../pages/style.css";
import React, { Fragment, useState } from "react";
import Head from "next/head";

import Popuplogin from "../components/popuplogin";
import Navbar8 from "../components/navbar8.js";
import Hero17 from "../components/hero17.js";
import Features24 from "../components/features24.js";
import CTA26 from "../components/cta26.js";
import Features25 from "../components/features25.js";
import Pricing14 from "../components/pricing14.js";
import Steps2 from "../components/steps2.js";
import Testimonial17 from "../components/testimonial17.js";
import Contact10 from "../components/contact10.js";
import Footer4 from "../components/footer4.js";
const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [modSecurity, setModSecurity] = useState(false);
  const [urls, setUrls] = useState<{ url: string; modSecurity: boolean }[]>([]);
  const handleConfirm = () => {
    if (url.trim() !== "") {
      setUrls([...urls, { url, modSecurity }]);
      setUrl("");
      setModSecurity(false);
      setModalOpen(false);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showLoginModal = () => {
    setIsModalVisible(true);
  };

  const closeLoginModal = () => {
    console.log("Modal is closing");
    setIsModalVisible(false);
  };

  const handleDelete = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  return (
    <>
      <div className="home-container">
        <Head>
          <title>As a DEV</title>
          <meta property="og:title" content="As a DEV" />
        </Head>

        <Navbar8
          page4Description={
            <Fragment>
              <span className="home-text100">
                Contact us for further assistance or inquiries.
              </span>
            </Fragment>
          }
          action1={
            <Fragment>
              <span className="home-text101">Sign Up</span>
            </Fragment>
          }
          link2={
            <Fragment>
              <span className="home-text102">#about</span>
            </Fragment>
          }
          page1={
            <Fragment>
              <span className="home-text103">Home</span>
            </Fragment>
          }
          link1={
            <Fragment>
              <span className="home-text104">#home</span>
            </Fragment>
          }
          page4={
            <Fragment>
              <span className="home-text105">Contact</span>
            </Fragment>
          }
          page2={
            <Fragment>
              <span className="home-text106">About</span>
            </Fragment>
          }
          link4={
            <Fragment>
              <span className="home-text107">#contact</span>
            </Fragment>
          }
          page1Description={
            <Fragment>
              <span className="home-text108">
                Navigate to the Home page for web security information.
              </span>
            </Fragment>
          }
          page2Description={
            <Fragment>
              <span className="home-text109">
                Learn more about our website and web security measures.
              </span>
            </Fragment>
          }
          link3={
            <Fragment>
              <span className="home-text110">#resources</span>
            </Fragment>
          }
          page3={
            <Fragment>
              <span className="home-text111">Resources</span>
            </Fragment>
          }
          page3Description={
            <Fragment>
              <span className="home-text112">
                Access resources and tools to enhance your web security.
              </span>
            </Fragment>
          }
          action2={
            <Fragment>
              <span onClick={showLoginModal} className="home-text113">
                Login
              </span>
            </Fragment>
          }
        ></Navbar8>

        {isModalVisible && <Popuplogin onClose={closeLoginModal} />}

        <Hero17
          action2={
            <Fragment>
              <span className="home-text114">Learn More</span>
            </Fragment>
          }
          action1={
            <Fragment>
              <span className="home-text115">Get Started</span>
            </Fragment>
          }
          heading1={
            <Fragment>
              <span className="home-text116">
                Protect Your Website with Web Security Measures
              </span>
            </Fragment>
          }
          content1={
            <Fragment>
              <span className="home-text117">
                Learn how to safeguard your online presence and data from cyber
                threats with our comprehensive web security resources and tips.
              </span>
            </Fragment>
          }
        ></Hero17>

        <Features24
          feature3Description={
            <Fragment>
              <span className="home-text118">
                Stay informed about the latest cyber threats and how to prevent
                them.
              </span>
            </Fragment>
          }
          feature3Title={
            <Fragment>
              <span className="home-text119">Threat Intelligence Updates</span>
            </Fragment>
          }
          feature2Description={
            <Fragment>
              <span className="home-text120">
                Access to tools and resources to enhance your website&apos;s
                security.
              </span>
            </Fragment>
          }
          feature1Title={
            <Fragment>
              <span className="home-text121">Educational Content</span>
            </Fragment>
          }
          feature1Description={
            <Fragment>
              <span className="home-text122">
                Learn about best practices and strategies to secure your
                website.
              </span>
            </Fragment>
          }
          feature2Title={
            <Fragment>
              <span className="home-text123">Security Resources</span>
            </Fragment>
          }
        ></Features24>

        <CTA26
          heading1={
            <Fragment>
              <span className="home-text124">Protect Your Website Today</span>
            </Fragment>
          }
          content1={
            <Fragment>
              <span className="home-text125">
                Learn how to safeguard your website from cyber threats and
                attacks with our comprehensive web security resources.
              </span>
            </Fragment>
          }
          action1={
            <Fragment>
              <span className="home-text126">Get Started</span>
            </Fragment>
          }
        ></CTA26>

        <Features25
          feature3Description={
            <Fragment>
              <span className="home-text127">
                Stay protected by regularly updating software and applications
                to patch vulnerabilities and enhance security measures.
              </span>
            </Fragment>
          }
          feature1Description={
            <Fragment>
              <span className="home-text128">
                Implement a strong firewall to monitor and control incoming and
                outgoing network traffic.
              </span>
            </Fragment>
          }
          feature2Title={
            <Fragment>
              <span className="home-text129">SSL Encryption</span>
            </Fragment>
          }
          feature1Title={
            <Fragment>
              <span className="home-text130">Firewall Protection</span>
            </Fragment>
          }
          feature2Description={
            <Fragment>
              <span className="home-text131">
                Secure data transmission with SSL encryption to protect
                sensitive information from being intercepted.
              </span>
            </Fragment>
          }
          feature3Title={
            <Fragment>
              <span className="home-text132">Regular Software Updates</span>
            </Fragment>
          }
        ></Features25>

        <Pricing14
          plan3Price={
            <Fragment>
              <span className="home-text133">$29.99/month</span>
            </Fragment>
          }
          plan3Action={
            <Fragment>
              <span className="home-text134">Protect my website</span>
            </Fragment>
          }
          plan11={
            <Fragment>
              <span className="home-text135">Basic plan</span>
            </Fragment>
          }
          plan1Action={
            <Fragment>
              <span className="home-text136">Sign up now</span>
            </Fragment>
          }
          plan31={
            <Fragment>
              <span className="home-text137">Enterprise plan</span>
            </Fragment>
          }
          plan3Feature41={
            <Fragment>
              <span className="home-text138">Feature text goes here</span>
            </Fragment>
          }
          plan1Feature2={
            <Fragment>
              <span className="home-text139">SSL Certificate</span>
            </Fragment>
          }
          plan2Feature11={
            <Fragment>
              <span className="home-text140">Feature text goes here</span>
            </Fragment>
          }
          plan3Feature51={
            <Fragment>
              <span className="home-text141">Feature text goes here</span>
            </Fragment>
          }
          plan2Feature41={
            <Fragment>
              <span className="home-text142">Feature text goes here</span>
            </Fragment>
          }
          plan2Feature2={
            <Fragment>
              <span className="home-text143">Weekly Security Audits</span>
            </Fragment>
          }
          plan3Feature21={
            <Fragment>
              <span className="home-text144">Feature text goes here</span>
            </Fragment>
          }
          plan2Feature4={
            <Fragment>
              <span className="home-text145">Feature text goes here</span>
            </Fragment>
          }
          plan2Yearly={
            <Fragment>
              <span className="home-text146">or $299 yearly</span>
            </Fragment>
          }
          plan1Action1={
            <Fragment>
              <span className="home-text147">Get started</span>
            </Fragment>
          }
          plan2Action={
            <Fragment>
              <span className="home-text148">Get started</span>
            </Fragment>
          }
          plan3Feature1={
            <Fragment>
              <span className="home-text149">Custom Security Rules</span>
            </Fragment>
          }
          plan2Feature3={
            <Fragment>
              <span className="home-text150">DDoS Protection</span>
            </Fragment>
          }
          plan1Price1={
            <Fragment>
              <span className="home-text151">$200/yr</span>
            </Fragment>
          }
          plan2={
            <Fragment>
              <span className="home-text152">Business plan</span>
            </Fragment>
          }
          plan2Feature21={
            <Fragment>
              <span className="home-text153">Feature text goes here</span>
            </Fragment>
          }
          plan2Action1={
            <Fragment>
              <span className="home-text154">Get started</span>
            </Fragment>
          }
          plan3Feature2={
            <Fragment>
              <span className="home-text155">
                Real-time Threat Intelligence
              </span>
            </Fragment>
          }
          content1={
            <Fragment>
              <span className="home-text156">
                Choose the perfect plan for you
              </span>
            </Fragment>
          }
          plan2Feature1={
            <Fragment>
              <span className="home-text157">Advanced Firewall Protection</span>
            </Fragment>
          }
          heading1={
            <Fragment>
              <span className="home-text158">Pricing plan</span>
            </Fragment>
          }
          plan3Feature31={
            <Fragment>
              <span className="home-text159">Feature text goes here</span>
            </Fragment>
          }
          plan1={
            <Fragment>
              <span className="home-text160">Basic plan</span>
            </Fragment>
          }
          plan21={
            <Fragment>
              <span className="home-text161">Business plan</span>
            </Fragment>
          }
          plan1Feature11={
            <Fragment>
              <span className="home-text162">Feature text goes here</span>
            </Fragment>
          }
          plan1Feature21={
            <Fragment>
              <span className="home-text163">Feature text goes here</span>
            </Fragment>
          }
          plan3Feature5={
            <Fragment>
              <span className="home-text164">Feature text goes here</span>
            </Fragment>
          }
          plan2Yearly1={
            <Fragment>
              <span className="home-text165">or $29 monthly</span>
            </Fragment>
          }
          plan2Price={
            <Fragment>
              <span className="home-text166">$19.99/month</span>
            </Fragment>
          }
          plan3Yearly1={
            <Fragment>
              <span className="home-text167">or $49 monthly</span>
            </Fragment>
          }
          plan2Feature31={
            <Fragment>
              <span className="home-text168">Feature text goes here</span>
            </Fragment>
          }
          plan3Feature11={
            <Fragment>
              <span className="home-text169">Feature text goes here</span>
            </Fragment>
          }
          plan1Yearly1={
            <Fragment>
              <span className="home-text170">or $20 monthly</span>
            </Fragment>
          }
          plan2Price1={
            <Fragment>
              <span className="home-text171">$299/yr</span>
            </Fragment>
          }
          plan3Yearly={
            <Fragment>
              <span className="home-text172">or $499 yearly</span>
            </Fragment>
          }
          plan3Feature4={
            <Fragment>
              <span className="home-text173">Feature text goes here</span>
            </Fragment>
          }
          plan3Price1={
            <Fragment>
              <span className="home-text174">$499/yr</span>
            </Fragment>
          }
          plan1Feature31={
            <Fragment>
              <span className="home-text175">Feature text goes here</span>
            </Fragment>
          }
          plan1Feature3={
            <Fragment>
              <span className="home-text176">Daily Malware Scans</span>
            </Fragment>
          }
          plan1Yearly={
            <Fragment>
              <span className="home-text177">or $200 yearly</span>
            </Fragment>
          }
          plan1Feature1={
            <Fragment>
              <span className="home-text178">24/7 Customer Support</span>
            </Fragment>
          }
          plan3Feature3={
            <Fragment>
              <span className="home-text179">Security Incident Response</span>
            </Fragment>
          }
          content2={
            <Fragment>
              <span className="home-text180">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <span
                  dangerouslySetInnerHTML={{
                    __html: " ",
                  }}
                />
              </span>
            </Fragment>
          }
          plan3Action1={
            <Fragment>
              <span className="home-text181">Get started</span>
            </Fragment>
          }
          plan1Price={
            <Fragment>
              <span className="home-text182">$9.99/month</span>
            </Fragment>
          }
          plan3={
            <Fragment>
              <span className="home-text183">Enterprise plan</span>
            </Fragment>
          }
        ></Pricing14>

        <Steps2
          step1Description={
            <Fragment>
              <span className="home-text184">
                Ensure all software on your devices and systems are up to date
                with the latest security patches.
              </span>
            </Fragment>
          }
          step3Description={
            <Fragment>
              <span className="home-text185">
                Add an extra layer of security by requiring a second form of
                verification to access your accounts.
              </span>
            </Fragment>
          }
          step2Title={
            <Fragment>
              <span className="home-text186">Use Strong Passwords</span>
            </Fragment>
          }
          step2Description={
            <Fragment>
              <span className="home-text187">
                Create complex passwords with a combination of letters, numbers,
                and special characters.
              </span>
            </Fragment>
          }
          step1Title={
            <Fragment>
              <span className="home-text188">Update Software Regularly</span>
            </Fragment>
          }
          step3Title={
            <Fragment>
              <span className="home-text189">
                Enable Two-Factor Authentication
              </span>
            </Fragment>
          }
          step4Description={
            <Fragment>
              <span className="home-text190">
                Frequently backup important data to prevent loss in case of a
                cyber attack or system failure.
              </span>
            </Fragment>
          }
          step4Title={
            <Fragment>
              <span className="home-text191">Backup Data Regularly</span>
            </Fragment>
          }
        ></Steps2>

        <Testimonial17
          author2Position={
            <Fragment>
              <span className="home-text192">CTO, Startup Y</span>
            </Fragment>
          }
          author1Position={
            <Fragment>
              <span className="home-text193">CEO, Tech Company X</span>
            </Fragment>
          }
          author1Name={
            <Fragment>
              <span className="home-text194">John Doe</span>
            </Fragment>
          }
          author3Name={
            <Fragment>
              <span className="home-text195">Michael Johnson</span>
            </Fragment>
          }
          review2={
            <Fragment>
              <span className="home-text196">
                I am impressed by the comprehensive resources on web security
                available here. Thank you for helping us stay protected.
              </span>
            </Fragment>
          }
          author2Name={
            <Fragment>
              <span className="home-text197">Jane Smith</span>
            </Fragment>
          }
          author4Position={
            <Fragment>
              <span className="home-text198">Security Analyst, Firm A</span>
            </Fragment>
          }
          author4Name={
            <Fragment>
              <span className="home-text199">Sarah Lee</span>
            </Fragment>
          }
          content1={
            <Fragment>
              <span className="home-text200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                eget tortor risus. Sed porttitor lectus nibh.
              </span>
            </Fragment>
          }
          author3Position={
            <Fragment>
              <span className="home-text201">Head of IT, Company Z</span>
            </Fragment>
          }
          review1={
            <Fragment>
              <span className="home-text202">
                The web security measures provided by this website have been
                instrumental in safeguarding our company&apos;s data. Highly
                recommended!
              </span>
            </Fragment>
          }
          heading1={
            <Fragment>
              <span className="home-text203">Testimonials</span>
            </Fragment>
          }
          review3={
            <Fragment>
              <span className="home-text204">
                This website is a valuable source of information on cyber
                threats and how to mitigate them effectively. Great job!
              </span>
            </Fragment>
          }
          review4={
            <Fragment>
              <span className="home-text205">
                As a security professional, I find the content here to be
                top-notch and up-to-date. Keep up the good work!
              </span>
            </Fragment>
          }
        ></Testimonial17>

        <Contact10
          content1={
            <Fragment>
              <span className="home-text206">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in ero.
              </span>
            </Fragment>
          }
          location1Description={
            <Fragment>
              <span className="home-text207">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in ero.
              </span>
            </Fragment>
          }
          heading1={
            <Fragment>
              <span className="home-text208">Locations</span>
            </Fragment>
          }
          location2Description={
            <Fragment>
              <span className="home-text209">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse varius enim in ero.
              </span>
            </Fragment>
          }
          location1={
            <Fragment>
              <span className="home-text210">Bucharest</span>
            </Fragment>
          }
          location2={
            <Fragment>
              <span className="home-text211">Cluj - Napoca</span>
            </Fragment>
          }
        ></Contact10>

        <Footer4
          link5={
            <Fragment>
              <span className="home-text212">Resources</span>
            </Fragment>
          }
          link3={
            <Fragment>
              <span className="home-text213">Services</span>
            </Fragment>
          }
          link1={
            <Fragment>
              <span className="home-text214">Home</span>
            </Fragment>
          }
          termsLink={
            <Fragment>
              <span className="home-text215">Terms of Use</span>
            </Fragment>
          }
          link2={
            <Fragment>
              <span className="home-text216">About Us</span>
            </Fragment>
          }
          link4={
            <Fragment>
              <span className="home-text217">Contact Us</span>
            </Fragment>
          }
          cookiesLink={
            <Fragment>
              <span className="home-text218">Cookies Policy</span>
            </Fragment>
          }
          privacyLink={
            <Fragment>
              <span className="home-text219">Privacy Policy</span>
            </Fragment>
          }
        ></Footer4>
      </div>

      <style jsx>
        {`
          .home-container {
            width: 100%;
            display: flex;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .home-text100 {
            display: inline-block;
          }
          .home-text101 {
            display: inline-block;
          }
          .home-text102 {
            display: inline-block;
          }
          .home-text103 {
            display: inline-block;
          }
          .home-text104 {
            display: inline-block;
          }
          .home-text105 {
            display: inline-block;
          }
          .home-text106 {
            display: inline-block;
          }
          .home-text107 {
            display: inline-block;
          }
          .home-text108 {
            display: inline-block;
          }
          .home-text109 {
            display: inline-block;
          }
          .home-text110 {
            display: inline-block;
          }
          .home-text111 {
            display: inline-block;
          }
          .home-text112 {
            display: inline-block;
          }
          .home-text113 {
            display: inline-block;
          }
          .home-text114 {
            display: inline-block;
          }
          .home-text115 {
            display: inline-block;
          }
          .home-text116 {
            display: inline-block;
          }
          .home-text117 {
            display: inline-block;
          }
          .home-text118 {
            display: inline-block;
          }
          .home-text119 {
            display: inline-block;
          }
          .home-text120 {
            display: inline-block;
          }
          .home-text121 {
            display: inline-block;
          }
          .home-text122 {
            display: inline-block;
          }
          .home-text123 {
            display: inline-block;
          }
          .home-text124 {
            display: inline-block;
          }
          .home-text125 {
            display: inline-block;
          }
          .home-text126 {
            display: inline-block;
          }
          .home-text127 {
            display: inline-block;
          }
          .home-text128 {
            display: inline-block;
          }
          .home-text129 {
            display: inline-block;
          }
          .home-text130 {
            display: inline-block;
          }
          .home-text131 {
            display: inline-block;
          }
          .home-text132 {
            display: inline-block;
          }
          .home-text133 {
            display: inline-block;
          }
          .home-text134 {
            display: inline-block;
          }
          .home-text135 {
            display: inline-block;
          }
          .home-text136 {
            display: inline-block;
          }
          .home-text137 {
            display: inline-block;
          }
          .home-text138 {
            display: inline-block;
          }
          .home-text139 {
            display: inline-block;
          }
          .home-text140 {
            display: inline-block;
          }
          .home-text141 {
            display: inline-block;
          }
          .home-text142 {
            display: inline-block;
          }
          .home-text143 {
            display: inline-block;
          }
          .home-text144 {
            display: inline-block;
          }
          .home-text145 {
            display: inline-block;
          }
          .home-text146 {
            display: inline-block;
          }
          .home-text147 {
            display: inline-block;
          }
          .home-text148 {
            display: inline-block;
          }
          .home-text149 {
            display: inline-block;
          }
          .home-text150 {
            display: inline-block;
          }
          .home-text151 {
            display: inline-block;
          }
          .home-text152 {
            display: inline-block;
          }
          .home-text153 {
            display: inline-block;
          }
          .home-text154 {
            display: inline-block;
          }
          .home-text155 {
            display: inline-block;
          }
          .home-text156 {
            display: inline-block;
          }
          .home-text157 {
            display: inline-block;
          }
          .home-text158 {
            display: inline-block;
          }
          .home-text159 {
            display: inline-block;
          }
          .home-text160 {
            display: inline-block;
          }
          .home-text161 {
            display: inline-block;
          }
          .home-text162 {
            display: inline-block;
          }
          .home-text163 {
            display: inline-block;
          }
          .home-text164 {
            display: inline-block;
          }
          .home-text165 {
            display: inline-block;
          }
          .home-text166 {
            display: inline-block;
          }
          .home-text167 {
            display: inline-block;
          }
          .home-text168 {
            display: inline-block;
          }
          .home-text169 {
            display: inline-block;
          }
          .home-text170 {
            display: inline-block;
          }
          .home-text171 {
            display: inline-block;
          }
          .home-text172 {
            display: inline-block;
          }
          .home-text173 {
            display: inline-block;
          }
          .home-text174 {
            display: inline-block;
          }
          .home-text175 {
            display: inline-block;
          }
          .home-text176 {
            display: inline-block;
          }
          .home-text177 {
            display: inline-block;
          }
          .home-text178 {
            display: inline-block;
          }
          .home-text179 {
            display: inline-block;
          }
          .home-text180 {
            display: inline-block;
          }
          .home-text181 {
            display: inline-block;
          }
          .home-text182 {
            display: inline-block;
          }
          .home-text183 {
            display: inline-block;
          }
          .home-text184 {
            display: inline-block;
          }
          .home-text185 {
            display: inline-block;
          }
          .home-text186 {
            display: inline-block;
          }
          .home-text187 {
            display: inline-block;
          }
          .home-text188 {
            display: inline-block;
          }
          .home-text189 {
            display: inline-block;
          }
          .home-text190 {
            display: inline-block;
          }
          .home-text191 {
            display: inline-block;
          }
          .home-text192 {
            display: inline-block;
          }
          .home-text193 {
            display: inline-block;
          }
          .home-text194 {
            display: inline-block;
          }
          .home-text195 {
            display: inline-block;
          }
          .home-text196 {
            display: inline-block;
          }
          .home-text197 {
            display: inline-block;
          }
          .home-text198 {
            display: inline-block;
          }
          .home-text199 {
            display: inline-block;
          }
          .home-text200 {
            display: inline-block;
          }
          .home-text201 {
            display: inline-block;
          }
          .home-text202 {
            display: inline-block;
          }
          .home-text203 {
            display: inline-block;
          }
          .home-text204 {
            display: inline-block;
          }
          .home-text205 {
            display: inline-block;
          }
          .home-text206 {
            display: inline-block;
          }
          .home-text207 {
            display: inline-block;
          }
          .home-text208 {
            display: inline-block;
          }
          .home-text209 {
            display: inline-block;
          }
          .home-text210 {
            display: inline-block;
          }
          .home-text211 {
            display: inline-block;
          }
          .home-text212 {
            display: inline-block;
          }
          .home-text213 {
            display: inline-block;
          }
          .home-text214 {
            display: inline-block;
          }
          .home-text215 {
            display: inline-block;
          }
          .home-text216 {
            display: inline-block;
          }
          .home-text217 {
            display: inline-block;
          }
          .home-text218 {
            display: inline-block;
          }
          .home-text219 {
            display: inline-block;
          }
        `}
      </style>
    </>
  );
};

export default Home;
